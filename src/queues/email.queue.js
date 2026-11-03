import { Queue } from "bullmq";
import { connection } from "../config/redis.js";

export const emailQueue = new Queue("email-queue", {
  connection,

  defaultJobOptions: {
    attempts: 5,

    backoff: {
      type: "exponential",
      delay: 1000,
    },

    removeOnComplete: {
      age: 24 * 60 * 60,
      count: 1000,
    },

    removeOnFail: {
      age: 7 * 24 * 60 * 60,
    },
  },
});
