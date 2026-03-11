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
