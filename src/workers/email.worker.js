import dotenv from "dotenv";
import { Worker } from "bullmq";

import { connection } from "../config/redis.js";
import { sendEmail } from "../services/email.service.js";

dotenv.config();

const worker = new Worker(
  "email-queue",

  async (job) => {
    console.log("Processing job:", job.id);
    console.log("Job data:", job.data);

    if (job.name !== "send-email") {
      throw new Error(`Unknown job type: ${job.name}`);
    }

    const result = await sendEmail(job.data);

    console.log("Email processed:", job.id);

    return {
      messageId: result.messageId,
      accepted: result.accepted,
    };
  },

  {
    connection,
    concurrency: 5,
  },
);

worker.on("completed", (job, result) => {
  console.log("Completed job:", job.id);
  console.log("Result:", result);
});

worker.on("failed", (job, error) => {
  console.error("Failed job:", job?.id);
  console.error("Reason:", error.message);
});

worker.on("error", (error) => {
  console.error("Worker error:", error);
});

async function shutdown() {
  console.log("Shutting down worker...");

  await worker.close();
  await connection.quit();

  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);
