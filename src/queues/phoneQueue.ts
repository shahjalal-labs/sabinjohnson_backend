import { Queue } from "bullmq";
import redisClient from "../helpers/redis";

export const phoneQueue = new Queue("phones", {
  connection: redisClient,
});
