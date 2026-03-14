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
router.get("/:id", ratingControllers.getRatingById);
router.patch("/:id", ratingControllers.updateRating);
router.delete("/:id", ratingControllers.deleteRating);

export const ratingRoutes = router;
