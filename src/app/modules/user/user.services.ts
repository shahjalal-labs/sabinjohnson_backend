import { User } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../shared/prisma";
import generateOTP from "../../../helpers/generateOtp";
import redisClient from "../../../helpers/redis";
import { phoneQueue } from "../../../queues/phoneQueue";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import bcrypt from "bcryptjs";
import { uploadInSpace } from "../../../helpers/uploadInSpace";

const createUser = async (payload: User) => {
  const existingPhone = await prisma.user.findUnique({
    where: { phoneNumber: payload.phoneNumber },
  });
  if (existingPhone)
    throw new ApiError(409, "User already exists using this phone number.");

  const existingEmail = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (existingEmail)
    throw new ApiError(409, "User already exists using this email.");

  // Prepare pending user object
  const pendingUserData = {
    email: payload.email,
    phoneNumber: payload.phoneNumber,
    fullName: payload.fullName,
    role: payload.role,
  };

  await redisClient.set(
    `pendingUser:${payload.phoneNumber}`,
    JSON.stringify(pendingUserData),
    "EX",
    300,
  );

  const otp = generateOTP();

  await redisClient.set(`otp:${payload.phoneNumber}`, otp, "EX", 300);

  await phoneQueue.add(
    "sendOtp",
    {
      phoneNumber: payload.phoneNumber,
      fullName: payload.fullName,
      otp,
    },
    {
      removeOnComplete: {
        age: 600,
        count: 20,
      },
    },
  );

  return otp;
};

const signupVerification = async (payload: {
  phoneNumber: string;
  otp: string;
}) => {
  const { phoneNumber, otp } = payload;

  const savedOtp = await redisClient.get(`otp:${phoneNumber}`);
  if (!savedOtp) {
    throw new ApiError(400, "Invalid or expired OTP.");
  }

  if (otp !== savedOtp) {
    throw new ApiError(401, "Invalid OTP.");
  }

  const pendingUserStr = await redisClient.get(`pendingUser:${phoneNumber}`);
  if (!pendingUserStr) {
    throw new ApiError(404, "No pending user found. Please sign up again.");
  }
  const pendingUser = JSON.parse(pendingUserStr);

  const createdUser = await prisma.$transaction(async (tx) => {
    return await tx.user.create({
      data: {
        email: pendingUser.email,
        phoneNumber: pendingUser.phoneNumber,
        fullName: pendingUser.fullName,
        password: pendingUser.password,
        role: pendingUser.role,
      },
    });
  });

  await Promise.all([
    redisClient.del(`otp:${phoneNumber}`),
    redisClient.del(`pendingUser:${phoneNumber}`),
  ]);

  const accessToken = jwtHelpers.generateToken(
    {
      id: createdUser.id,
      fullName: createdUser.fullName,
      role: createdUser.role,
    },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string,
  );

  return { id: createdUser.id, role: createdUser.role, accessToken };
};

const resendOTP = async (phoneNumber: string) => {
  const pendingUserStr = await redisClient.get(`pendingUser:${phoneNumber}`);
  if (!pendingUserStr) {
    throw new ApiError(404, "No pending user found. Please sign up again.");
  }
  const pendingUser = JSON.parse(pendingUserStr);

  const otp = generateOTP();

  await redisClient.set(`otp:${phoneNumber}`, otp, "EX", 300);

  await phoneQueue.add(
    "sendOtp",
    {
      phoneNumber: pendingUser.phoneNumber,
      fullName: pendingUser.fullName,
      otp,
    },
    {
      removeOnComplete: {
        age: 600,
        count: 20,
      },
    },
  );

  return otp;
};

const setPassword = async (userId: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found!");

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.jwt.gen_salt),
  );
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
  return;
};

const profileSetup = async (
  userId: string,
  payload: Partial<User>,
  file: Express.Multer.File,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found!");

  let profileImage;

  if (file) {
    profileImage = await uploadInSpace(file, "ProfileImages");
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      ...payload,
      profileImage,
    },
  });
  return;
};

const getSingleUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new ApiError(404, "user not found!");
  }

  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
  };
};

export const userService = {
  createUser,
  signupVerification,
  resendOTP,
  setPassword,
  profileSetup,
  getSingleUser,
};
