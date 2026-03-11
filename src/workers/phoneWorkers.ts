import { Worker } from "bullmq";
import redisClient from "../helpers/redis";
import sendOTPByPhone from "../helpers/sendPhoneOTP";

new Worker(
  "phones",
  async (job) => {
    const { phoneNumber, fullName, otp } = job.data;

    if (job.name === "sendOtp") {
      // Simulate sending OTP via SMS (replace with actual SMS service integration)
      console.log(
        `In workers: 📱 Sending OTP ${otp} to ${phoneNumber} for ${fullName} (Job ID: ${job.id})`,
      );
      // Here you would integrate with an SMS service like Twilio, Nexmo, etc.
    } else if (job.name === "forgotPasswordOtp") {
      console.log(
        `In workers: 📱 Sending forgot password OTP ${otp} to ${phoneNumber} for ${fullName} (Job ID: ${job.id})`,
      );
      // Integrate with SMS service for forgot password OTP
    } else {
      console.warn(`Unknown job name: ${job.name}`);
      return;
    }
    try {
      await sendOTPByPhone(phoneNumber, fullName, otp);
      console.log(`✅ OTP sent to ${phoneNumber} for job: ${job.name}`);
    } catch (err) {
      console.error("Failed to send OTP:", err);
    }
  },
  { connection: redisClient },
);
