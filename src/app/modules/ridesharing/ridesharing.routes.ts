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
router.get("/", ridesharingControllers.getAllRidesharings);
router.get("/:id", ridesharingControllers.getRidesharingById);
router.patch("/:id", ridesharingControllers.updateRidesharing);
router.delete("/:id", ridesharingControllers.deleteRidesharing);

export const ridesharingRoutes = router;
