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
