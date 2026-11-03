import { Queue } from "bullmq";
import { connection } from "../config/redis.js";

export const deadLetterQueue = new Queue("email-dead-letter-queue", {
  connection,
});
