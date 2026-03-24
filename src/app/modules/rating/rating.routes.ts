import express from "express";
import { ratingControllers } from "./rating.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", auth(UserRole.User), ratingControllers.createRating);
router.get(
  "/rider/:riderId/reviews",
  auth(UserRole.User),
  ratingControllers.riderReviews,
);

export const ratingRoutes = router;
