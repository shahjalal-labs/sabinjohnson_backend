import prisma from "../../../shared/prisma";
import bcrypt from "bcryptjs";
import ApiError from "../../../errors/ApiErrors";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import { User } from "@prisma/client";
import generateOTP from "../../../helpers/generateOtp";
import redisClient from "../../../helpers/redis";
import { uploadInSpace } from "../../../helpers/uploadInSpace";
import { emailQueue } from "../../../queues/emailQueue";
import { Secret } from "jsonwebtoken";
import { phoneQueue } from "../../../queues/phoneQueue";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const authLogin = async (payload: {
  identity: string;
  password: string;
  fcmToken?: string;
}) => {
  const isEmail = emailRegex.test(payload.identity);

  let user: User | null = null;

  if (isEmail) {
    user = await prisma.user.findUnique({
      where: {
        email: payload.identity,
      },
    });
  } else {
    user = await prisma.user.findUnique({
      where: {
        phoneNumber: payload.identity,
      },
    });
  }

  if (!user) throw new ApiError(404, "User not found");
  if (user.password === null) {
    throw new ApiError(
      401,
      "You need to set a password or use forgot password to set a password for your account",
    );
  }

  const isPasswordValid = await bcrypt.compare(
    payload.password,
    user?.password as string,
  );

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (payload.fcmToken) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        fcmToken: payload.fcmToken,
      },
    });
  }

  const accessToken = jwtHelpers.generateToken(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string,
  );

  return {
    id: user.id,
    accessToken,
    role: user.role,
  };
};

const userLocationUpdate = async (
  userId: string,
  userLocation: { longitude: number; latitude: number },
) => {
  const redisGeoKey = "userLocations";

  await redisClient.geoadd(
    redisGeoKey,
    userLocation.longitude,
    userLocation.latitude,
    userId,
  );

  return;
};

const riderLocationUpdate = async (
  userId: string,
  userLocation: { longitude: number; latitude: number },
) => {
  const redisGeoKey = "riderLocations";

  await redisClient.geoadd(
    redisGeoKey,
    userLocation.longitude,
    userLocation.latitude,
    userId,
  );

  return;
};

const foodDeliverLocationUpdate = async (
  userId: string,
  userLocation: { longitude: number; latitude: number },
) => {
  const redisGeoKey = "foodDeliverLocations";

  await redisClient.geoadd(
    redisGeoKey,
    userLocation.longitude,
    userLocation.latitude,
    userId,
  );

  return;
};

const sendForgotPassword = async (identity: string) => {
  const isEmail = emailRegex.test(identity);

  if (isEmail) {
    const user = await prisma.user.findUnique({
      where: {
        email: identity,
      },
    });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const otp = generateOTP(); // 4-digit OTP

    await redisClient.set(`otp:${identity}`, otp, "EX", 300);

    await emailQueue.add(
      "forgotPasswordOtp",
      {
        email: user.email,
        fullName: user.fullName,
        otp: otp,
      },
      {
        removeOnComplete: {
          age: 600,
          count: 20,
        },
      },
    );

    return otp;
  } else {
    const user = await prisma.user.findUnique({
      where: {
        phoneNumber: identity,
      },
    });
    if (!user) throw new ApiError(404, "User not found");

    const otp = generateOTP(); // 4-digit OTP

    await redisClient.set(`otp:${identity}`, otp, "EX", 300);

    await phoneQueue.add(
      "forgotPasswordOtp",
      {
        phoneNumber: user.phoneNumber,
        fullName: user.fullName,
        otp: otp,
      },
      {
        removeOnComplete: {
          age: 600,
          count: 20,
        },
      },
    );

    return otp;
  }
};

const verifyForgotPassword = async (payload: {
  identity: string;
  otp: string;
}) => {
  const { identity, otp } = payload;
  const isEmail = emailRegex.test(identity);

  let user: User | null = null;

  if (isEmail) {
    user = await prisma.user.findUnique({
      where: {
        email: identity,
      },
    });
  } else {
    user = await prisma.user.findUnique({
      where: {
        phoneNumber: identity,
      },
    });
  }

  if (!user) throw new ApiError(404, "User not found");

  const userId = user.id;

  const savedOtp = await redisClient.get(`otp:${identity}`);
  if (!savedOtp) throw new ApiError(400, "Invalid or expired OTP.");

  if (otp !== savedOtp) throw new ApiError(401, "Invalid OTP.");

  await redisClient.del(`otp:${identity}`);

  const forgetToken = jwtHelpers.generateToken(
    { id: userId },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string,
  );

  return { forgetToken };
};

const resetForgotPassword = async (newPassword: string, userId: string) => {
  const existingUser = await prisma.user.findUnique({ where: { id: userId } });
  if (!existingUser) throw new ApiError(404, "User not found");

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.jwt.gen_salt),
  );

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
  return;
};

const updateProfileImage = async (
  userId: string,
  file: Express.Multer.File,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found for edit");

  if (!file) throw new ApiError(400, "No file uploaded");
  const profileImage = await uploadInSpace(file, "profileImages");

  await prisma.user.update({
    where: { id: userId },
    data: {
      profileImage: file ? profileImage : user.profileImage,
    },
  });

  return;
};

const myProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      phoneNumber: true,
      fullName: true,
      address: true,
      city: true,
      profileImage: true,
    },
  });

  if (!user) throw new ApiError(404, "User not found!");
  return user;
};

const updateProfile = async (userId: string, userData: Partial<User>) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found for edit");

  const isExistingEmail = await prisma.user.findUnique({
    where: { email: userData.email, NOT: { id: userId } },
  });
  if (isExistingEmail) {
    throw new ApiError(400, "Email already in use by another account");
  }

  const isExistingPhone = await prisma.user.findUnique({
    where: { phoneNumber: userData.phoneNumber, NOT: { id: userId } },
  });
  if (isExistingPhone) {
    throw new ApiError(400, "Phone number already in use by another account");
  }

  await prisma.user.update({
    where: { id: userId },
    data: userData,
  });

  return;
};

const changePassword = async (
  newPassword: string,
  userId: string,
  oldPassword: string,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordValid = await bcrypt.compare(
    oldPassword,
    user.password as string,
  );

  if (!isPasswordValid) throw new ApiError(401, "Wrong old password");

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.jwt.gen_salt),
  );

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password: hashedPassword,
    },
  });
  return;
};

const deleteAccount = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found");

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
  return;
};

export const authService = {
  authLogin,
  myProfile,
  updateProfile,
  userLocationUpdate,
  riderLocationUpdate,
  foodDeliverLocationUpdate,
  sendForgotPassword,
  verifyForgotPassword,
  resetForgotPassword,
  updateProfileImage,
  changePassword,
  deleteAccount,
};
