import { Router } from "express";
import { z } from "zod";
import { emailQueue } from "../queues/email.queue.js";

const router = Router();

const emailSchema = z.object({
  email: z.string().email(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(5000),
});

router.post("/send-email", async (req, res) => {
  try {
    const validation = emailSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid email data",
        errors: validation.error.flatten(),
      });
    }

    const emailData = validation.data;

    const job = await emailQueue.add("send-email", emailData, {
      delay: 10000,
      attempts: 5,

      backoff: {
        type: "exponential",
        delay: 1000,
      },
    });

    return res.status(202).json({
      success: true,
      message: "Email job accepted for processing",
      jobId: job.id,
      status: "queued",
    });
  } catch (error) {
    console.error("Failed to enqueue email:", error);

    return res.status(503).json({
      success: false,
      message: "Email service is temporarily unavailable",
    });
  }
});


router.get("/jobs/:jobId", async (req, res) => {
  try {
    const job = await emailQueue.getJob(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const state = await job.getState();

    return res.json({
      success: true,
      jobId: job.id,
      jobName: job.name,
      state,
      attemptsMade: job.attemptsMade,
      failedReason: job.failedReason || null,
      result: job.returnvalue,
    });
  } catch (error) {
    console.error("Job status error:", error);

    return res.status(500).json({
      success: false,
      message: "Could not retrieve job status",
    });
  }
});

export default router;
