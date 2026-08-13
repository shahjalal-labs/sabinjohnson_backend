# ridesharingFullContent.md

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
│   │   │   │   ├── ridesharing.controller.ts
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

37 directories, 93 files
```

## 📁 ridesharing Module Tree

```bash
/home/sj/web/smt_project/sabinjohnson_backend/src/app/modules/ridesharing
├── ridesharing.controller.ts
├── ridesharing.routes.ts
├── ridesharing.service.ts
└── ridesharing.validation.ts

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

## 🎮 ridesharing.controller.ts

```ts
import { ridesharingServices } from "./ridesharing.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const findRider = catchAsync(async (req, res) => {
  const data = await ridesharingServices.findRider(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Riders has been found successfully",
    data,
  });
});

const sendRequestToRider = catchAsync(async (req, res) => {
  await ridesharingServices.sendRequestToRider(req.user.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Request has been sent to rider successfully",
  });
});

const myRideRequests = catchAsync(async (req, res) => {
  const result = await ridesharingServices.myRideRequests(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "My ride requests have been retrieved successfully",
    data: result,
  });
});

const currentRide = catchAsync(async (req, res) => {
  const result = await ridesharingServices.currentRide(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Current ride has been retrieved successfully",
    data: result,
  });
});

const cancelRide = catchAsync(async (req, res) => {
  const result = await ridesharingServices.cancelRide(
    req.params.rideId,
    req.user.id,
    req.body.cancelReason,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Ride has been cancelled successfully",
    data: result,
  });
});

const startRide = catchAsync(async (req, res) => {
  await ridesharingServices.startRide(req.params.rideId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Ride has been started successfully",
  });
});

const endRide = catchAsync(async (req, res) => {
  await ridesharingServices.endRide(req.params.rideId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Ride has been completed successfully",
  });
});

const payWithBepay = catchAsync(async (req, res) => {
  await ridesharingServices.payWithBepay(req.params.rideId, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "BePay payment has been processed successfully",
  });
});

const cashPayment = catchAsync(async (req, res) => {
  await ridesharingServices.cashPayment(req.params.rideId, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Cash payment has been processed successfully",
  });
});

const payWithCard = catchAsync(async (req, res) => {
  await ridesharingServices.payWithCard(
    req.params.rideId,
    req.user.id,
    req.body.paymentMethodId,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Card payment has been processed successfully",
  });
});

const payWithPaypal = catchAsync(async (req, res) => {
  const data = await ridesharingServices.payWithPaypal(
    req.params.rideId,
    req.user.id,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "PayPal payment has been processed successfully",
    data,
  });
});

const getRidesharingById = catchAsync(async (req, res) => {
  const result = await ridesharingServices.getRidesharingById(
    req.params.rideId,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "ridesharing has been retrived successfully",
    data: result,
  });
});

const myRideHistory = catchAsync(async (req, res) => {
  const result = await ridesharingServices.myRideHistory(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "My ride history has been retrieved successfully",
    data: result,
  });
});
const myWalletHistory = catchAsync(async (req, res) => {
  const result = await ridesharingServices.myWalletHistory(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "My wallet history has been retrieved successfully",
    data: result,
  });
});

export const ridesharingControllers = {
  findRider,
  sendRequestToRider,
  myRideRequests,
  currentRide,
  cancelRide,
  startRide,
  endRide,
  payWithBepay,
  cashPayment,
  payWithCard,
  payWithPaypal,
  getRidesharingById,
  myRideHistory,
  myWalletHistory,
};
```

## 📝 ridesharing.validation.ts

```ts
import * as z from "zod";

export const createRidesharingSchema = z.object({
  // Define fields
  name: z.string(),
});

const payWithPaypalSchema = z.object({
  orderId: z.string({ required_error: "orderId is required" }).min(1),
});

export const RidesharingSchemaValidation = {
  createRidesharingSchema,
  payWithPaypalSchema,
};
```

## 🔧 ridesharing.routes.ts

```ts
import express from "express";
import { ridesharingControllers } from "./ridesharing.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/find-rider",
  auth(UserRole.User),
  ridesharingControllers.findRider,
);
router.post(
  "/send-request",
  auth(UserRole.User),
  ridesharingControllers.sendRequestToRider,
);
router.get(
  "/my-ride-requests",
  auth(UserRole.Rider),
  ridesharingControllers.myRideRequests,
);
router.get(
  "/current-ride",
  auth(UserRole.User),
  ridesharingControllers.currentRide,
);
router.post(
  "/cancel-ride/:rideId",
  auth(UserRole.User, UserRole.Rider),
  ridesharingControllers.cancelRide,
);
router.post(
  "/start-ride/:rideId",
  auth(UserRole.Rider),
  ridesharingControllers.startRide,
);
router.post(
  "/end-ride/:rideId",
  auth(UserRole.Rider),
  ridesharingControllers.endRide,
);
router.post(
  "/bepay-payment/:rideId",
  auth(UserRole.User),
  ridesharingControllers.payWithBepay,
);
router.post(
  "/cash-payment/:rideId",
  auth(UserRole.User),
  ridesharingControllers.cashPayment,
);
router.post(
  "/card-payment/:rideId",
  auth(UserRole.User),
  ridesharingControllers.payWithCard,
);
router.post(
  "/paypal-payment/:rideId",
  auth(UserRole.User),
  ridesharingControllers.payWithPaypal,
);
router.get("/:rideId", auth(), ridesharingControllers.getRidesharingById);
router.get(
  "/my/ride-history",
  auth(UserRole.User),
  ridesharingControllers.myRideHistory,
);
router.get(
  "/my/wallet-history",
  auth(UserRole.Rider),
  ridesharingControllers.myWalletHistory,
);

export const ridesharingRoutes = router;
```

## 🛠️ ridesharing.service.ts

```ts
import { OrderType, Ridesharing } from "@prisma/client";
import { calculateDistanceKm } from "../../../helpers/calculateDistance";
import redisClient from "../../../helpers/redis";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { startOfWeek, endOfWeek, endOfMonth, startOfMonth } from "date-fns";
import stripe from "../../../config/stripe";
import { payPalClient } from "../../../config/paypal";
import paypal from "@paypal/checkout-server-sdk";
import { Request, Response } from "express";

const findRider = async (payload: {
  pickLatitude: number;
  pickLongitude: number;
  pickupAddress: string;
  destinationLat: number;
  destinationLong: number;
  destinationAddress: string;
  paywith: string;
  orderType: OrderType;
  orderId?: string;
}) => {
  const radius = 5; // km
  const avgSpeedKmPerHour = 30;
  const avgRatePerKm = 1;

  const riders = await redisClient.georadius(
    "riderLocations",
    payload.pickLongitude,
    payload.pickLatitude,
    radius,
    "km",
    "WITHDIST",
  );

  if (!riders || riders.length === 0) {
    return [];
  }

  // Trip distance (pickup → destination)
  const tripDistanceKm = calculateDistanceKm(
    payload.pickLatitude,
    payload.pickLongitude,
    payload.destinationLat,
    payload.destinationLong,
  );

  const etaMinutes = Math.ceil((tripDistanceKm / avgSpeedKmPerHour) * 60);
  const estimatedFare = Number((tripDistanceKm * avgRatePerKm).toFixed(2));

  const result = await Promise.all(
    riders.map(async (rider: any) => {
      const riderId = rider[0];
      const riderDistanceKm = parseFloat(rider[1]);

      const [riderInfo, vehicleInfo] = await Promise.all([
        prisma.user.findUnique({
          where: { id: riderId },
          select: {
            fullName: true,
            phoneNumber: true,
          },
        }),
        prisma.vehicle.findUnique({
          where: { userId: riderId },
          select: {
            vehicleName: true,
          },
        }),
      ]);

      return {
        riderInfo: {
          id: riderId,
          fullName: riderInfo?.fullName,
          avgRating: 4.5, // Placeholder for average rating
          phoneNumber: riderInfo?.phoneNumber,
        },
        vehicleInfo: {
          vehicleName: vehicleInfo?.vehicleName,
        },
        rideInfo: {
          riderDistanceKm: Number(riderDistanceKm.toFixed(2)), // rider → pickup
          tripDistanceKm: Number(tripDistanceKm.toFixed(2)), // pickup → destination
          etaMinutes,
          estimatedFare,
          payWith: payload.paywith,
        },
        orderInfo: {
          orderType: payload.orderType || OrderType.Ridesharing,
          orderId: payload.orderId,
        },
        pickup: {
          latitude: payload.pickLatitude,
          longitude: payload.pickLongitude,
          address: payload.pickupAddress,
        },
        destination: {
          latitude: payload.destinationLat,
          longitude: payload.destinationLong,
          address: payload.destinationAddress,
        },
      };
    }),
  );

  return result;
};

const myRideRequests = async (userId: string) => {
  const riderRequests = await prisma.ridesharing.findMany({
    where: {
      riderId: userId,
      status: "Pending",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
        },
      },
      rider: {
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
        },
      },
      pickupAddress: true,
      destinationAddress: true,
      etaMinutes: true,
      userDistanceKm: true,
      cost: true,
      payWith: true,
      createdAt: true,
      status: true,
    },
  });

  return riderRequests;
};

export const sendRequestToRider = async (
  userId: string,
  requestData: Ridesharing,
) => {
  await prisma.ridesharing.create({
    data: {
      ...requestData,
      userId,
    },
  });

  const riderRequests = await prisma.ridesharing.findMany({
    where: {
      riderId: requestData.riderId,
      status: "Pending",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
        },
      },
      rider: {
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
        },
      },
      pickupAddress: true,
      destinationAddress: true,
      etaMinutes: true,
      userDistanceKm: true,
      cost: true,
      payWith: true,
      createdAt: true,
      status: true,
    },
  });

  return riderRequests;
};

export const getRidesharingById = async (id: string) => {
  const rideInfo = await prisma.ridesharing.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      status: true,
      user: {
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
        },
      },
      rider: {
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
        },
      },
      pickupLatitude: true,
      pickupLongitude: true,
      pickupAddress: true,
      destinationLat: true,
      destinationLong: true,
      destinationAddress: true,
      etaMinutes: true,
      cost: true,
      payWith: true,
      createdAt: true,
    },
  });

  return rideInfo;
};

export const approveRequest = async (riderId: string, rideId: string) => {
  await prisma.ridesharing.update({
    where: { id: rideId },
    data: {
      status: "Accepted",
    },
  });

  const ridesharingInfo = await prisma.ridesharing.findMany({
    where: {
      riderId: riderId,
      status: "Pending",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
        },
      },
      rider: {
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
        },
      },
      pickupAddress: true,
      destinationAddress: true,
      etaMinutes: true,
      userDistanceKm: true,
      cost: true,
      payWith: true,
      createdAt: true,
      status: true,
    },
  });

  return ridesharingInfo;
};

export const currentRide = async (userId: string) => {
  const currentRide = await prisma.ridesharing.findFirst({
    where: {
      userId: userId,
      OR: [{ status: "Accepted" }, { status: "Started" }],
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      rider: {
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
        },
      },
      pickupLongitude: true,
      pickupAddress: true,
      destinationLat: true,
      destinationLong: true,
      destinationAddress: true,
      etaMinutes: true,
      cost: true,
      payWith: true,
      createdAt: true,
      status: true,
    },
  });

  return currentRide;
};

export const cancelRide = async (
  rideId: string,
  userId: string,
  cancelReason?: string,
) => {
  const rideInfo = await prisma.ridesharing.findUnique({
    where: { id: rideId },
  });
  if (!rideInfo) throw new ApiError(404, "Ride not found");

  const cancelledBy = rideInfo.userId === userId ? "User" : "Rider";

  await prisma.ridesharing.update({
    where: { id: rideId },
    data: {
      status: "Cancelled",
      cancelledBy,
      cancelReason: cancelReason || null,
    },
  });
  return;
};

export const startRide = async (rideId: string) => {
  await prisma.ridesharing.update({
    where: { id: rideId },
    data: {
      status: "Started",
    },
  });
  return;
};

export const endRide = async (rideId: string) => {
  await prisma.ridesharing.update({
    where: { id: rideId },
    data: {
      status: "Completed",
    },
  });
  return;
};

const payWithBepay = async (rideId: string, userId: string) => {
  const rideInfo = await prisma.ridesharing.findUnique({
    where: { id: rideId },
  });
  if (!rideInfo) throw new ApiError(404, "Ride not found");

  const alreadyPaid = await prisma.payment.findUnique({
    where: { rideId_userId: { rideId, userId } },
  });
  if (alreadyPaid) throw new ApiError(400, "Payment already processed");

  await prisma.$transaction(async (tx) => {
    await tx.ridesharing.update({
      where: { id: rideId },
      data: {
        status: "Paid",
      },
    });

    await tx.payment.create({
      data: {
        userId,
        amount: rideInfo.cost,
        method: "BePay",
        rideId,
        riderId: rideInfo.riderId,
      },
    });

    await tx.user.update({
      where: { id: rideInfo.riderId },
      data: {
        walletBalance: {
          increment: rideInfo.cost,
        },
      },
    });
  });

  return;
};

const cashPayment = async (rideId: string, userId: string) => {
  const rideInfo = await prisma.ridesharing.findUnique({
    where: { id: rideId },
  });
  if (!rideInfo) throw new ApiError(404, "Ride not found");
  if (rideInfo.userId !== userId) throw new ApiError(403, "Unauthorized");

  const alreadyPaid = await prisma.payment.findUnique({
    where: { rideId_userId: { rideId, userId } },
  });
  if (alreadyPaid) throw new ApiError(400, "Payment already processed");

  await prisma.$transaction(async (tx) => {
    await tx.ridesharing.update({
      where: { id: rideId },
      data: {
        status: "Paid",
      },
    });

    await tx.payment.create({
      data: {
        userId,
        amount: rideInfo.cost,
        method: "Cash",
        rideId,
        riderId: rideInfo.riderId,
      },
    });
  });

  return;
};

const payWithCard = async (
  rideId: string,
  userId: string,
  paymentMethodId: string,
) => {
  const riderInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!riderInfo) throw new ApiError(404, "Rider not found");

  const rideInfo = await prisma.ridesharing.findUnique({
    where: { id: rideId },
  });
  if (!rideInfo) throw new ApiError(404, "Ride not found");

  const alreadyPaid = await prisma.payment.findUnique({
    where: { rideId_userId: { rideId, userId } },
  });
  if (alreadyPaid) throw new ApiError(400, "Payment already processed");

  let customerId = riderInfo.customerId;

  if (!customerId) {
    const customer = await stripe.customers.create({
      name: riderInfo.fullName,
      email: riderInfo.email,
    });
    customerId = customer.id;

    await prisma.user.update({
      where: { id: userId },
      data: { customerId },
    });

    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customerId,
    });
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
  }
  await stripe.paymentMethods.attach(paymentMethodId, {
    customer: customerId,
  });
  await stripe.customers.update(customerId, {
    invoice_settings: {
      default_payment_method: paymentMethodId,
    },
  });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(rideInfo.cost * 100), // Convert to cents
    currency: "usd",
    payment_method: paymentMethodId,
    customer: customerId,
    confirm: true,
    description: `Payment success for ride ${rideId}`,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
  });

  if (paymentIntent.status === "succeeded") {
    await prisma.$transaction(async (tx) => {
      await tx.ridesharing.update({
        where: { id: rideId },
        data: {
          status: "Paid",
        },
      });

      await tx.payment.create({
        data: {
          userId,
          amount: rideInfo.cost,
          method: "Card",
          status: "Completed",
          rideId,
          riderId: rideInfo.riderId,
        },
      });

      await tx.user.update({
        where: { id: rideInfo.riderId },
        data: {
          walletBalance: {
            increment: rideInfo.cost,
          },
        },
      });
    });
    return;
  }
  throw new ApiError(400, "Payment failed");
};

const payWithPaypal = async (rideId: string, userId: string) => {
  const rideInfo = await prisma.ridesharing.findUnique({
    where: { id: rideId },
  });
  if (!rideInfo) throw new ApiError(404, "Ride not found");

  const alreadyPaid = await prisma.payment.findUnique({
    where: { rideId_userId: { rideId, userId } },
  });
  if (alreadyPaid) throw new ApiError(400, "Payment already processed");

  const client = payPalClient();
  const request = new paypal.orders.OrdersCreateRequest();

  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: rideInfo.cost.toFixed(2),
        },
        reference_id: userId,
        custom_id: rideId,
      },
    ],
    application_context: {
      brand_name: `Ride payment for ${rideInfo.riderId}`,
      landing_page: "NO_PREFERENCE",
      user_action: "PAY_NOW",
      shipping_preference: "NO_SHIPPING",
      return_url: `${process.env.BACKEND_BASE_URL}/api/v1/paypal-payment/success`,
      cancel_url: `${process.env.BACKEND_BASE_URL}/api/v1/paypal-payment/cancel`,
    },
  });

  const order = await client.execute(request);
  const approvalUrl = order.result.links.find(
    (link: any) => link.rel === "approve",
  )?.href;

  if (!approvalUrl) throw new ApiError(500, "PayPal approval URL missing");
  return {
    checkoutUrl: approvalUrl,
  };
};

export const paypalWebhookService = async (req: Request, res: Response) => {
  try {
    console.log("Webhook received:", req.body.event_type);

    if (req.body.event_type === "CHECKOUT.ORDER.APPROVED") {
      const userId = req.body.resource.purchase_units[0].reference_id;
      const rideId = req.body.resource.purchase_units[0].custom_id;

      const rideInfo = await prisma.ridesharing.findUnique({
        where: { id: rideId },
      });
      if (!rideInfo) throw new ApiError(404, "Ride not found");

      await prisma.$transaction(async (tx) => {
        await tx.ridesharing.update({
          where: { id: rideId },
          data: {
            status: "Paid",
          },
        });

        await tx.payment.create({
          data: {
            userId,
            amount: rideInfo.cost,
            method: "PayPal",
            rideId,
            riderId: rideInfo.riderId,
          },
        });

        await tx.user.update({
          where: { id: rideInfo.riderId },
          data: {
            walletBalance: {
              increment: rideInfo.cost,
            },
          },
        });
      });

      console.log("Ride Payment marked as paid for rideId:", rideId);
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err);
    res.sendStatus(500);
  }
};

const myRideHistory = async (userId: string) => {
  const rideHistory = await prisma.ridesharing.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      rider: {
        select: {
          id: true,
          fullName: true,
          profileImage: true,
          riderRatings: true,
        },
      },
      pickupAddress: true,
      destinationAddress: true,
      cost: true,
      payWith: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const rideHistoriesWithRatings = await Promise.all(
    rideHistory.map(async (ride) => {
      const ratings = ride.rider.riderRatings;
      const averageRating =
        ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length || 0;

      return {
        ...ride,
        rider: {
          id: ride.rider.id,
          fullName: ride.rider.fullName,
          profileImage: ride.rider.profileImage,
          averageRating: Number(averageRating.toFixed(2)),
        },
      };
    }),
  );

  return rideHistoriesWithRatings;
};

const myWalletHistory = async (userId: string) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userInfo) throw new ApiError(404, "User not found");

  const now = new Date();

  const startMonth = startOfMonth(now);
  const endMonth = endOfMonth(now);
  const startWeek = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const endWeek = endOfWeek(now, { weekStartsOn: 1 }); // Sunday

  const lastOneMonthPayments = await prisma.payment.findMany({
    where: {
      riderId: userId,
      status: "Completed",
      createdAt: {
        gte: startMonth,
        lte: endMonth,
      },
    },
  });

  const lastWeekPayments = await prisma.payment.findMany({
    where: {
      riderId: userId,
      status: "Completed",
      createdAt: {
        gte: startWeek,
        lte: endWeek,
      },
    },
  });

  const rideCount = await prisma.ridesharing.count({
    where: {
      riderId: userId,
      OR: [{ status: "Completed" }, { status: "Paid" }],
    },
  });

  const weekDaysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const daysMap: Record<string, number> = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };

  lastWeekPayments.forEach((p) => {
    const day = new Date(p.createdAt).toLocaleDateString("en-US", {
      weekday: "short",
    });

    daysMap[day] += p.amount;
  });

  const lastWeekEarnings = weekDaysOrder.map((day) => ({
    day,
    amount: daysMap[day],
  }));

  const withdrawalHistory = await prisma.withdrawal.findMany({
    where: {
      riderId: userId,
    },
    select: {
      id: true,
      amount: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    rideCount,
    walletBalance: userInfo.walletBalance,
    lastOneMonthEarnings: lastOneMonthPayments.reduce(
      (sum, p) => sum + p.amount,
      0,
    ),
    lastWeekEarnings,
    withdrawalHistory,
  };
};

export const ridesharingServices = {
  findRider,
  sendRequestToRider,
  myRideRequests,
  currentRide,
  approveRequest,
  cancelRide,
  startRide,
  endRide,
  payWithBepay,
  cashPayment,
  payWithCard,
  payWithPaypal,
  getRidesharingById,
  myRideHistory,
  myWalletHistory,
};
```

# socketFullContent.md

## 🌲 Full Project Structure

## 📁 socket Module Tree

```bash
/home/sj/web/smt_project/sabinjohnson_backend/src/app/socket
├── socket.service.ts
└── verifyToken.ts

1 directory, 2 files
```

## 📄 verifyToken.ts

```ts
import { WebSocket } from "ws";
import config from "../../config";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import { Secret } from "jsonwebtoken";

export function verifyWebSocketToken(ws: WebSocket, token: string) {
  if (!token) {
    sendWsError(ws, "You are not authenticated");
    ws.close();
    return null;
  }

  try {
    const decoded = jwtHelpers.verifyToken(
      token,
      config.jwt.jwt_secret as Secret,
    );
    return decoded;
  } catch (error: any) {
    let message = "Invalid token!";

    if (error?.name === "TokenExpiredError") {
      message = "Token has expired!";
    }

    sendWsError(ws, message);
    ws.close();
    return null;
  }
}

function sendWsError(ws: WebSocket, message: string) {
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(JSON.stringify({ type: "error", message }));
  }
}
```

## 🛠️ socket.service.ts

```ts
import { WebSocket, WebSocketServer } from "ws";
import { Request } from "express";
import { verifyWebSocketToken } from "./verifyToken";
import { parse } from "url";
import prisma from "../../shared/prisma";
import {
  approveRequest,
  cancelRide,
  endRide,
  getRidesharingById,
  sendRequestToRider,
  startRide,
} from "../modules/ridesharing/ridesharing.service";

interface CustomWebSocket extends WebSocket {
  userId?: string;
}

const connectedUsers = new Map<string, CustomWebSocket>();
let wss;

export function setupWebSocketServer(server: any) {
  wss = new WebSocketServer({ server });

  wss.on("connection", async (ws: CustomWebSocket, req: Request) => {
    const { query } = parse(req.url!, true);
    let authToken = req.headers["x-token"] as string;
    if (!authToken && query["x-token"]) {
      authToken = Array.isArray(query["x-token"])
        ? query["x-token"][0]
        : query["x-token"];
    }
    const decoded = verifyWebSocketToken(ws, authToken);
    if (!decoded) return;

    const userId = decoded.id;
    ws.userId = userId;
    connectedUsers.set(userId, ws);

    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.ping();
    }, 30000);

    ws.on("message", async (message: any) => {
      try {
        const {
          type,
          receiverId,
          rideId,
          roomId,
          content,
          requestData,
          cancelReason,
        } = JSON.parse(message.toString());

        switch (type) {
          case "send-ride-request":
            try {
              if (!ws.userId) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Authentication required",
                  }),
                );
              }
              if (!requestData) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Request data is required",
                  }),
                );
              }

              const receiverSocket = connectedUsers.get(requestData.riderId);

              if (
                !receiverSocket ||
                receiverSocket.readyState !== WebSocket.OPEN
              ) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Receiver is not online",
                  }),
                );
              }

              const rideRequests = await sendRequestToRider(
                userId,
                requestData,
              );

              // send ONLY to receiver
              receiverSocket.send(
                JSON.stringify({
                  type: "ride-requests",
                  message: "You have a new ride request",
                  rideRequests,
                }),
              );

              ws.send(
                JSON.stringify({
                  type: "ride-request-sent",
                  message: "Your ride request has been sent successfully",
                }),
              );
              break;
            } catch (error) {
              console.log(error);
            }
            break;

          case "approve-ride-request":
            try {
              if (!ws.userId) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Authentication required",
                  }),
                );
              }

              const rideInfo = await getRidesharingById(rideId);
              if (!rideInfo) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Ride request not found",
                  }),
                );
              }

              if (rideInfo.status !== "Pending") {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Only pending ride requests can be approved",
                  }),
                );
              }

              const receiverSocket = connectedUsers.get(rideInfo.user.id);

              if (
                !receiverSocket ||
                receiverSocket.readyState !== WebSocket.OPEN
              ) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Receiver is not online",
                  }),
                );
              }

              const rideRequests = await approveRequest(userId, rideId);

              // send ONLY to receiver
              receiverSocket.send(
                JSON.stringify({
                  type: "approved-ride-request",
                  rideInfo: rideInfo,
                  message: "Your ride request has been approved",
                }),
              );

              ws.send(
                JSON.stringify({
                  type: "ride-requests",
                  message: "You have approved a ride request",
                  rideRequests,
                }),
              );

              break;
            } catch (error) {
              console.log(error);
            }
            break;

          case "cancel-ride-request":
            try {
              if (!ws.userId) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Authentication required",
                  }),
                );
              }

              const rideInfo = await getRidesharingById(rideId);
              if (!rideInfo) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Ride request not found",
                  }),
                );
              }

              if (rideInfo.status !== "Pending") {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Only pending ride requests can be cancelled",
                  }),
                );
              }

              await cancelRide(rideId, userId, cancelReason);

              if (rideInfo.user.id === userId) {
                const receiverSocket = connectedUsers.get(rideInfo.rider.id);
                // send ONLY to receiver
                receiverSocket?.send(
                  JSON.stringify({
                    type: "cancel-ride-request",
                    message: "User has cancelled the ride request",
                    rideInfo: rideInfo,
                  }),
                );

                ws.send(
                  JSON.stringify({
                    type: "cancel-ride-request",
                    message: "You have cancelled a ride request",
                    rideInfo: rideInfo,
                  }),
                );
              } else {
                const receiverSocket = connectedUsers.get(rideInfo.user.id);
                // send ONLY to receiver
                receiverSocket?.send(
                  JSON.stringify({
                    type: "cancel-ride-request",
                    message: "Rider has cancelled the ride request",
                    rideInfo: rideInfo,
                  }),
                );

                ws.send(
                  JSON.stringify({
                    type: "cancel-ride-request",
                    message: "You have cancelled a ride request",
                    rideInfo: rideInfo,
                  }),
                );
              }

              break;
            } catch (error) {
              console.log(error);
            }
            break;

          case "start-ride":
            try {
              if (!ws.userId) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Authentication required",
                  }),
                );
              }

              const rideInfo = await getRidesharingById(rideId);
              if (!rideInfo) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Ride request not found",
                  }),
                );
              }

              if (rideInfo.status !== "Accepted") {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Only accepted ride requests can be started",
                  }),
                );
              }

              const receiverSocket = connectedUsers.get(rideInfo.user.id);

              await startRide(rideId);

              // send ONLY to receiver
              receiverSocket?.send(
                JSON.stringify({
                  type: "start-ride",
                  message: "Your ride request has been started",
                  rideInfo: rideInfo,
                }),
              );

              ws.send(
                JSON.stringify({
                  type: "start-ride",
                  message: "You have started a ride",
                  rideInfo: rideInfo,
                }),
              );

              break;
            } catch (error) {
              console.log(error);
            }
            break;

          case "end-ride":
            try {
              if (!ws.userId) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Authentication required",
                  }),
                );
              }

              const rideInfo = await getRidesharingById(rideId);
              if (!rideInfo) {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Ride request not found",
                  }),
                );
              }

              if (rideInfo.status !== "Started") {
                return ws.send(
                  JSON.stringify({
                    type: "error",
                    message: "Only started ride requests can be ended",
                  }),
                );
              }

              const receiverSocket = connectedUsers.get(rideInfo.user.id);

              await endRide(rideId);

              // send ONLY to receiver
              receiverSocket?.send(
                JSON.stringify({
                  type: "end-ride",
                  message: "Your ride request has been ended",
                  rideInfo: rideInfo,
                }),
              );

              ws.send(
                JSON.stringify({
                  type: "end-ride",
                  message: "You have ended a ride",
                  rideInfo: rideInfo,
                }),
              );

              break;
            } catch (error) {
              console.log(error);
            }
            break;

          case "subscribe-room": {
            if (!ws.userId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Authentication required",
                }),
              );
            }
            if (!receiverId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "receiver ID is required",
                }),
              );
            }

            const userIds = [userId, receiverId].sort().join("_");
            const roomInfo = await prisma.room.upsert({
              where: {
                userIds,
              },
              create: {
                user1Id: userId,
                user2Id: receiverId,
                userIds,
              },
              update: {},
              select: {
                id: true,
                user1: {
                  select: {
                    id: true,
                    fullName: true,
                    profileImage: true,
                    phoneNumber: true,
                  },
                },
                user2: {
                  select: {
                    id: true,
                    fullName: true,
                    profileImage: true,
                    phoneNumber: true,
                  },
                },
                messages: {
                  orderBy: { createdAt: "desc" },
                  select: {
                    id: true,
                    content: true,
                    senderId: true,
                    createdAt: true,
                  },
                },
              },
            });

            ws.send(
              JSON.stringify({
                type: "subscribed-room",
                message: "Subscribed to room successfully",
                roomInfo: {
                  id: roomInfo.id,
                  user:
                    roomInfo.user1.id === userId
                      ? roomInfo.user2
                      : roomInfo.user1,
                  message: roomInfo.messages,
                },
              }),
            );

            break;
          }

          case "send-message": {
            if (!ws.userId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "Authentication required",
                }),
              );
            }
            if (!receiverId || !roomId) {
              return ws.send(
                JSON.stringify({
                  type: "error",
                  message: "receiver ID & room ID is required",
                }),
              );
            }

            const message = await prisma.message.create({
              data: {
                content,
                senderId: userId,
                roomId,
              },
              select: {
                id: true,
                content: true,
                senderId: true,
                createdAt: true,
              },
            });

            const receiverSocket = connectedUsers.get(receiverId);
            receiverSocket?.send(
              JSON.stringify({
                type: "new-message",
                receiverId,
                message: message,
              }),
            );

            ws.send(
              JSON.stringify({
                type: "message-sent",
                message: "Message sent successfully",
              }),
            );

            break;
          }

          default:
            ws.send(
              JSON.stringify({
                type: "error",
                message: "Invalid message type",
              }),
            );
        }
      } catch (err) {
        ws.send(
          JSON.stringify({ type: "error", message: "Invalid JSON format" }),
        );
      }
    });

    ws.on("close", () => {
      connectedUsers.delete(userId);
      console.log("WebSocket client disconnected!");
      clearInterval(interval);
    });
  });
}

export const socket = { wss };
```

I will implement websocket Front end part. So I need to understand the back end socket pattern. Please guide me everything details. so that I can implement the logic. You will guide me only the data pattern like send event etc, response got etc.

like the below:--

event: send offer

```json
{
  "type": "send-offer",
  "roomId": "6a3d08a74d2a64cc41ca18eb",
  "price": 200,
  "description": "Special offer from chat",
  "taxAmount": 18.5,
  "taxPercentage": 8.25
}
```

> response in sender(send offer):

```json
{
  "type": "message-sent",
  "roomId": "6a3d08a74d2a64cc41ca18eb",
  "message": {
    "id": "6a5094b6408f163a368f2951",
    "content": "Offer: $200",
    "fileUrl": [],
    "senderId": "6a3a4975e2711c114e140174",
    "roomId": "6a3d08a74d2a64cc41ca18eb",
    "messageType": "OFFER",
    "offerId": "6a5094b5408f163a368f2950",
    "createdAt": "2026-07-10T06:44:06.412Z",
    "updatedAt": "2026-07-10T06:44:06.412Z",
    "sender": {
      "id": "6a3a4975e2711c114e140174",
      "fullName": "vendor enterprise",
      "businessName": "Vendor Trading",
      "profileImage": "https://api.zenexcloud.com/emdadullah/uploads/profile/1782882622941-v8ovn054wze.jpg"
    },
    "offer": {
      "id": "6a5094b5408f163a368f2950",
      "pingId": null,
      "userId": "6a3a4975e2711c114e140174",
      "receiverId": "69c232fa86e922a1753f41e1",
      "price": 200,
      "description": "Special offer from chat",
      "status": "PENDING",
      "offerType": "DIRECT",
      "adminFee": null,
      "stripeFee": null,
      "netAmount": null,
      "taxAmount": 18.5,
      "taxPercentage": 8.25,
      "totalAmount": null,
      "disputeReason": null,
      "deliveredAt": null,
      "completedAt": null,
      "expiresAt": null,
      "stripePaymentIntentId": null,
      "paymentMethodId": null,
      "autoCompleteJobId": null,
      "createdAt": "2026-07-10T06:44:05.642Z",
      "updatedAt": "2026-07-10T06:44:05.642Z",
      "ping": null
    }
  }
}
```

> Response in reciever (send offer):

```json
{
  "type": "new-message",
  "roomId": "6a3d08a74d2a64cc41ca18eb",
  "message": {
    "id": "6a5094b6408f163a368f2951",
    "content": "Offer: $200",
    "fileUrl": [],
    "senderId": "6a3a4975e2711c114e140174",
    "roomId": "6a3d08a74d2a64cc41ca18eb",
    "messageType": "OFFER",
    "offerId": "6a5094b5408f163a368f2950",
    "createdAt": "2026-07-10T06:44:06.412Z",
    "updatedAt": "2026-07-10T06:44:06.412Z",
    "sender": {
      "id": "6a3a4975e2711c114e140174",
      "fullName": "vendor enterprise",
      "businessName": "Vendor Trading",
      "profileImage": "https://api.zenexcloud.com/emdadullah/uploads/profile/1782882622941-v8ovn054wze.jpg"
    },
    "offer": {
      "id": "6a5094b5408f163a368f2950",
      "pingId": null,
      "userId": "6a3a4975e2711c114e140174",
      "receiverId": "69c232fa86e922a1753f41e1",
      "price": 200,
      "description": "Special offer from chat",
      "status": "PENDING",
      "offerType": "DIRECT",
      "adminFee": null,
      "stripeFee": null,
      "netAmount": null,
      "taxAmount": 18.5,
      "taxPercentage": 8.25,
      "totalAmount": null,
      "disputeReason": null,
      "deliveredAt": null,
      "completedAt": null,
      "expiresAt": null,
      "stripePaymentIntentId": null,
      "paymentMethodId": null,
      "autoCompleteJobId": null,
      "createdAt": "2026-07-10T06:44:05.642Z",
      "updatedAt": "2026-07-10T06:44:05.642Z",
      "ping": null
    }
  },
  "senderId": "6a3a4975e2711c114e140174"
}
```

Need the details guideline. clarify me.
