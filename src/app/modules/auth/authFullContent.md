# authFullContent.md

## 🌲 Full Project Structure

```bash
/home/sj/web/smt_project/sabinjohnson_backend
├── bun.lock
├── ecosystem.config.js
├── module.js
├── package.json
├── package-lock.json
├── prisma
│   ├── schema.prisma
│   └── seed.ts
├── prometheus.yml
├── public
│   └── record.m4a
├── README.md
├── src
│   ├── app
│   │   ├── interfaces
│   │   │   ├── common.ts
│   │   │   └── file.ts
│   │   ├── middlewares
│   │   │   ├── auth.ts
│   │   │   ├── forgetAuth.ts
│   │   │   ├── globalErrorHandler.ts
│   │   │   ├── parseBodyData.ts
│   │   │   └── validateRequest.ts
│   │   ├── modules
│   │   │   ├── auth
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.validation.ts
│   │   │   ├── category
│   │   │   │   ├── category.controller.ts
│   │   │   │   ├── category.routes.ts
│   │   │   │   ├── category.service.ts
│   │   │   │   └── category.validation.ts
│   │   │   ├── home
│   │   │   │   └── sj
│   │   │   │       └── web
│   │   │   │           └── smt_project
│   │   │   │               └── sabinjohnson_backend
│   │   │   │                   └── src
│   │   │   │                       └── app
│   │   │   │                           └── modules
│   │   │   │                               └── ridesharing
│   │   │   ├── label
│   │   │   │   ├── label.controller.ts
│   │   │   │   ├── label.routes.ts
│   │   │   │   ├── label.service.ts
│   │   │   │   └── label.validation.ts
│   │   │   ├── rating
│   │   │   │   ├── rating.controller.ts
│   │   │   │   ├── rating.routes.ts
│   │   │   │   ├── rating.service.ts
│   │   │   │   └── rating.validation.ts
│   │   │   ├── ridesharing
│   │   │   │   ├── ridesharing.api.http
│   │   │   │   ├── ridesharing.controller.ts
│   │   │   │   ├── ridesharingFullContent.md
│   │   │   │   ├── ridesharing.routes.ts
│   │   │   │   ├── ridesharing.service.ts
│   │   │   │   └── ridesharing.validation.ts
│   │   │   ├── user
│   │   │   │   ├── user.controller.ts
│   │   │   │   ├── user.route.ts
│   │   │   │   ├── user.services.ts
│   │   │   │   └── user.validation.ts
│   │   │   ├── vehicle
│   │   │   │   ├── vehicle.controller.ts
│   │   │   │   ├── vehicle.routes.ts
│   │   │   │   ├── vehicle.service.ts
│   │   │   │   └── vehicle.validation.ts
│   │   │   └── withdrawal
│   │   │       ├── withdrawal.controller.ts
│   │   │       ├── withdrawal.routes.ts
│   │   │       ├── withdrawal.service.ts
│   │   │       └── withdrawal.validation.ts
│   │   ├── routes
│   │   │   └── index.ts
│   │   └── socket
│   │       ├── socket.service.ts
│   │       └── verifyToken.ts
│   ├── app.ts
│   ├── bullBoard.ts
│   ├── config
│   │   ├── index.ts
│   │   ├── paypal.ts
│   │   └── stripe.ts
│   ├── errors
│   │   ├── ApiErrors.ts
│   │   ├── handleClientError.ts
│   │   ├── handleValidationError.ts
│   │   ├── handleZodError.ts
│   │   └── parsePrismaValidationError.ts
│   ├── helpers
│   │   ├── calculateDistance.ts
│   │   ├── encryption.ts
│   │   ├── fileUploader.ts
│   │   ├── generateOtp.ts
│   │   ├── jwtHelpers.ts
│   │   ├── redis.ts
│   │   ├── sendEmailOTP.ts
│   │   ├── sendPhoneOTP.ts
│   │   └── uploadInSpace.ts
│   ├── interfaces
│   │   ├── common.ts
│   │   ├── error.ts
│   │   ├── file.ts
│   │   ├── index.d.ts
│   │   └── paginations.ts
│   ├── public
│   │   ├── payment-cancel.html
│   │   └── payment-success.html
│   ├── queues
│   │   ├── emailQueue.ts
│   │   └── phoneQueue.ts
│   ├── server.ts
│   ├── shared
│   │   ├── catchAsync.ts
│   │   ├── pagination.ts
│   │   ├── pick.ts
│   │   ├── prisma.ts
│   │   ├── searchFilter.ts
│   │   └── sendResponse.ts
│   ├── types
│   │   └── index.ts
│   └── workers
│       ├── emailWorker.ts
│       └── phoneWorkers.ts
├── tsconfig.json
├── uploads
│   └── google.png
└── vercel.json

37 directories, 95 files
```

## 📁 auth Module Tree

```bash
/home/sj/web/smt_project/sabinjohnson_backend/src/app/modules/auth
├── auth.controller.ts
├── auth.routes.ts
├── auth.service.ts
└── auth.validation.ts

1 directory, 4 files
```

## 📋 schema.prisma

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id              String        @id @default(auto()) @map("_id") @db.ObjectId
  fullName        String
  email           String        @unique
  phoneNumber     String        @unique
  password        String?
  city            String?
  address         String?
  profileImage    String?
  fcmToken        String?
  role            UserRole      @default(User)
  status          UserStatus    @default(Active)
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt
  userRide        Ridesharing[] @relation("User")
  vehicle         Vehicle?
  walletBalance   Float         @default(0)
  customerId      String?
  riderRide       Ridesharing[] @relation("Rider")
  room1           Room[]        @relation("User1")
  room2           Room[]        @relation("User2")
  riderRatings    Rating[]      @relation("Rider")
  userRatings     Rating[]      @relation("User")
  orders          Order[]
  paymentsAsUser  Payment[]     @relation("User")
  paymentsAsRider Payment[]     @relation("Rider")
  withdrawals     Withdrawal[]

  @@map("users")
}

enum UserStatus {
  Active
  Blocked
  Deleted
}

enum UserRole {
  User
  Rider
  Food_Deliver
  Admin
}

model Vehicle {
  id                String        @id @default(auto()) @map("_id") @db.ObjectId
  userId            String        @unique @db.ObjectId
  vehicleName       String
  model             String
  licensePlate      String
  vehicleImage      String?
  idFrontImage      String?
  idBackImage       String?
  licenseFrontImage String?
  licenseBackImage  String?
  status            VehicleStatus @default(Pending)
  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt
  user              User          @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("vehicles")
}

enum VehicleStatus {
  Pending
  Approved
  Rejected
}

model Label {
  id                 String   @id @default(auto()) @map("_id") @db.ObjectId
  userId             String   @db.ObjectId
  labelName          String
  destinationLat     Float
  destinationLong    Float
  destinationAddress String
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt

  @@unique([userId, labelName])
  @@map("labels")
}

model Ridesharing {
  id                 String            @id @default(auto()) @map("_id") @db.ObjectId
  userId             String            @db.ObjectId
  riderId            String            @db.ObjectId
  pickupLatitude     Float
  pickupLongitude    Float
  pickupAddress      String
  destinationLat     Float
  destinationLong    Float
  destinationAddress String
  userDistanceKm     Float
  riderDistanceKm    Float
  etaMinutes         Int
  cost               Float
  payWith            String
  orderType          OrderType         @default(Ridesharing)
  status             RidesharingStatus @default(Pending)
  cancelledBy        UserRole?
  cancelReason       String?
  orderId            String?           @db.ObjectId
  createdAt          DateTime          @default(now())
  updatedAt          DateTime          @updatedAt
  user               User              @relation("User", fields: [userId], references: [id], onDelete: Cascade)
  rider              User              @relation("Rider", fields: [riderId], references: [id], onDelete: Cascade)
  payments           Payment[]

  @@map("ridesharing")
}

enum OrderType {
  Ridesharing
  FoodDelivery
}

enum RidesharingStatus {
  Pending
  Accepted
  Started
  Completed
  Paid
  Cancelled
}

model Payment {
  id        String        @id @default(auto()) @map("_id") @db.ObjectId
  rideId    String        @db.ObjectId
  userId    String        @db.ObjectId
  riderId   String        @db.ObjectId
  amount    Float
  method    PaymentMethod @default(Cash)
  status    PaymentStatus @default(Completed)
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt
  ride      Ridesharing   @relation(fields: [rideId], references: [id], onDelete: Cascade)
  user      User          @relation("User", fields: [userId], references: [id], onDelete: Cascade)
  rider     User          @relation("Rider", fields: [riderId], references: [id], onDelete: Cascade)

  @@unique([rideId, userId])
  @@map("payments")
}

enum PaymentMethod {
  BePay
  Cash
  Card
  PayPal
}

enum PaymentStatus {
  Pending
  Completed
  Failed
}

model Withdrawal {
  id        String           @id @default(auto()) @map("_id") @db.ObjectId
  riderId   String           @db.ObjectId
  amount    Float
  method    PayoutMethod     @default(BePay)
  status    WithdrawalStatus @default(Pending)
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt
  rider     User             @relation(fields: [riderId], references: [id], onDelete: Cascade)

  @@map("withdrawals")
}

enum PayoutMethod {
  PayPal
  BePay
  BankTransfer
}

enum WithdrawalStatus {
  Pending
  Completed
  Failed
}

model Category {
  id           String   @id @default(auto()) @map("_id") @db.ObjectId
  categoryName String   @unique
  thumbnail    String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@map("categories")
}

model Order {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("orders")
}

model Rating {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  rideId    String   @db.ObjectId
  riderId   String   @db.ObjectId
  userId    String   @db.ObjectId
  rating    Float
  comment   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  rider     User     @relation("Rider", fields: [riderId], references: [id], onDelete: Cascade)
  user      User     @relation("User", fields: [userId], references: [id], onDelete: Cascade)

  @@unique([rideId, userId])
  @@map("ratings")
}

model Room {
  id        String    @id @default(auto()) @map("_id") @db.ObjectId
  user1Id   String    @db.ObjectId
  user2Id   String    @db.ObjectId
  userIds   String    @unique
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  messages  Message[]
  user1     User      @relation("User1", fields: [user1Id], references: [id], onDelete: Cascade)
  user2     User      @relation("User2", fields: [user2Id], references: [id], onDelete: Cascade)

  @@map("rooms")
}

model Message {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  roomId    String   @db.ObjectId
  senderId  String   @db.ObjectId
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  room      Room     @relation(fields: [roomId], references: [id], onDelete: Cascade)

  @@map("messages")
}
```

## 📦 package.json

```json
{
  "name": "sabinjohnson_backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "concurrently \"node ./dist/server.js\" \"node ./dist/workers/emailWorker.js\" \"node ./dist/workers/phoneWorkers.js\"",
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "concurrently \"ts-node-dev --respawn --transpile-only src/server.ts\" \"ts-node-dev --respawn --transpile-only src/workers/emailWorker.ts\" \"ts-node-dev --respawn --transpile-only src/workers/phoneWorkers.ts\"",
    "build": "tsc && cp -r src/public dist/",
    "postinstall": "prisma generate"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  },
  "keywords": [],
  "author": "Ruhul-Amin",
  "license": "ISC",
  "description": "Sabin Johnson Backend",
  "devDependencies": {
    "@types/bcryptjs": "^2.4.6",
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20.14.11",
    "@types/nodemailer": "^6.4.17",
    "@types/paypal__checkout-server-sdk": "^1.0.8",
    "@types/ws": "^8.18.1",
    "concurrently": "^9.2.1",
    "prisma": "^6.17.1",
    "ts-node": "^10.9.2",
    "ts-node-dev": "^2.0.0",
    "typescript": "^5.5.3"
  },
  "dependencies": {
    "@aws-sdk/client-s3": "^3.837.0",
    "@aws-sdk/lib-storage": "^3.837.0",
    "@bull-board/express": "^6.13.0",
    "@paypal/checkout-server-sdk": "^1.0.3",
    "@prisma/client": "^6.17.1",
    "@types/jsonwebtoken": "^9.0.6",
    "@types/multer": "^1.4.11",
    "axios": "^1.14.0",
    "bcryptjs": "^2.4.3",
    "bullmq": "^5.59.0",
    "cors": "^2.8.5",
    "date-fns": "^4.1.0",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "express-basic-auth": "^1.2.1",
    "http-status": "^1.7.4",
    "ioredis": "^5.8.0",
    "jsonwebtoken": "^9.0.2",
    "mongodb": "^6.8.0",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^7.0.9",
    "nodemon": "^3.1.4",
    "prom-client": "^15.1.3",
    "stripe": "^21.0.1",
    "ws": "^8.18.3",
    "zod": "^3.23.8"
  }
}
```

## 📝 auth.validation.ts

```ts
import { z } from "zod";

const authLoginSchema = z.object({
  identity: z
    .string()
    .email("Invalid email address")
    .or(z.string().min(10, "Phone number must be at least 10 characters long")),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  fcmToken: z
    .string()
    .min(1, "FCM Token must be at least 1 character long")
    .optional(),
});

const googleLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First Name is required"),
  fcmToken: z.string().min(1, "FCM token is required"),
});

const locationUpdateSchema = z.object({
  latitude: z
    .number()
    .min(-90, "Latitude must be greater than or equal to -90")
    .max(90, "Latitude must be less than or equal to 90"),
  longitude: z
    .number()
    .min(-180, "Longitude must be greater than or equal to -180")
    .max(180, "Longitude must be less than or equal to 180"),
});

const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters long")
    .optional(),
  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters long")
    .optional(),
  mobile: z
    .string()
    .min(10, "Mobile must be at least 10 characters long")
    .optional(),
});

export const authValidation = {
  authLoginSchema,
  updateProfileSchema,
  googleLoginSchema,
  locationUpdateSchema,
};
```

## 🔧 auth.routes.ts

```ts
import express from "express";
import { authController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpers/fileUploader";
import forgetAuth from "../../middlewares/forgetAuth";

const router = express.Router();

router.post(
  "/login",
  validateRequest(authValidation.authLoginSchema),
  authController.authLogin,
);
router.get("/profile", auth(), authController.myProfile);
router.patch(
  "/update/user-location",
  auth(),
  validateRequest(authValidation.locationUpdateSchema),
  authController.userLocationUpdate,
);
router.patch(
  "/update/rider-location",
  auth(),
  validateRequest(authValidation.locationUpdateSchema),
  authController.riderLocationUpdate,
);
router.patch(
  "/update/food-deliver-location",
  auth(),
  validateRequest(authValidation.locationUpdateSchema),
  authController.foodDeliverLocationUpdate,
);
router.post("/send-forget-otp", authController.sendForgotPassword);
router.post("/verify-forget-otp", authController.verifyForgotPasswordOtpCode);
router.patch("/reset-password", forgetAuth(), authController.resetPassword);
router.patch(
  "/update/profile-image",
  auth(),
  fileUploader.profileImage,
  authController.updateProfileImage,
);
router.patch("/update-profile", auth(), authController.updateProfile);
router.patch("/change-password", auth(), authController.changePassword);
router.delete("/delete-account", auth(), authController.deleteAccount);

export const authRoute = router;
```

## 🎮 auth.controller.ts

```ts
import catchAsync from "../../../shared/catchAsync";
import { authService } from "./auth.service";
import sendResponse from "../../../shared/sendResponse";

const authLogin = catchAsync(async (req, res) => {
  const result = await authService.authLogin(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: result,
  });
});

//update user location
const userLocationUpdate = catchAsync(async (req, res) => {
  const { id } = req.user;
  await authService.userLocationUpdate(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your location updated successfully",
  });
});

//update rider location
const riderLocationUpdate = catchAsync(async (req, res) => {
  const { id } = req.user;
  await authService.riderLocationUpdate(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your location updated successfully",
  });
});

//update food deliver location
const foodDeliverLocationUpdate = catchAsync(async (req, res) => {
  const { id } = req.user;
  await authService.foodDeliverLocationUpdate(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your location updated successfully",
  });
});

const sendForgotPassword = catchAsync(async (req, res) => {
  const response = await authService.sendForgotPassword(req.body.identity);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP send successfully",
    data: response,
  });
});

const verifyForgotPasswordOtpCode = catchAsync(async (req, res) => {
  const response = await authService.verifyForgotPassword(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP verified successfully.",
    data: response,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { newPassword } = req.body;
  const result = await authService.resetForgotPassword(newPassword, userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Password reset successfully.",
    data: result,
  });
});

const updateProfileImage = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const file = req.file as Express.Multer.File;
  await authService.updateProfileImage(userId, file);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile image updated successfully.",
  });
});

// get profile for logged in user
const myProfile = catchAsync(async (req, res) => {
  const { id } = req.user;
  const user = await authService.myProfile(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your profile has been retrieved successfully",
    data: user,
  });
});

const updateProfile = catchAsync(async (req, res) => {
  const { id } = req.user;
  await authService.updateProfile(id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your profile has been updated successfully",
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { id } = req.user;
  await authService.changePassword(
    req.body.newPassword,
    id,
    req.body.oldPassword,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your password has been updated successfully",
  });
});

const deleteAccount = catchAsync(async (req, res) => {
  const { id } = req.user;
  await authService.deleteAccount(id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Your account has been deleted successfully",
  });
});

export const authController = {
  authLogin,
  myProfile,
  updateProfile,
  userLocationUpdate,
  riderLocationUpdate,
  foodDeliverLocationUpdate,
  sendForgotPassword,
  verifyForgotPasswordOtpCode,
  resetPassword,
  updateProfileImage,
  changePassword,
  deleteAccount,
};
```

## 🛠️ auth.service.ts

```ts
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
```
