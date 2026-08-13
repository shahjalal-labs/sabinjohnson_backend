import express from "express";
import { UserControllers } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpers/fileUploader";
import { parseBodyData } from "../../middlewares/parseBodyData";

const router = express.Router();

router.post(
  "/create",
  validateRequest(userValidation.userRegisterValidationSchema),
  UserControllers.createUser,
);
router.post(
  "/signup-verification",
  validateRequest(userValidation.verificationSchema),
  UserControllers.signupVerification,
);
router.post(
  "/resend-otp",
  validateRequest(userValidation.resendOTPSchema),
  UserControllers.resendOTP,
);
router.post(
  "/set-password",
  auth(),
  validateRequest(userValidation.setPasswordSchema),
  UserControllers.setPassword,
);
router.patch(
  "/profile-setup",
  auth(),
  fileUploader.profileImage,
  parseBodyData,
  UserControllers.profileSetup,
);
router.patch(
  "/toggle-online",
  auth(),
  UserControllers.toggleOnlineStatus,
);
router.get("/:id", UserControllers.getSingleUser);

export const userRoutes = router;
