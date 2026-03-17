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
router.get("/:rideId", auth(), ridesharingControllers.getRidesharingById);
router.get(
  "/my/ride-history",
  auth(UserRole.User),
  ridesharingControllers.myRideHistory,
);

export const ridesharingRoutes = router;
