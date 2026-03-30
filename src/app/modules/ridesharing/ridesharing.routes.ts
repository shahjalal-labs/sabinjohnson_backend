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
