import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { userService } from "./user.services";

// register user
const createUser = catchAsync(async (req, res) => {
  const result = await userService.createUser(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Please verify your phone number with the OTP sent.",
    data: result,
  });
});

// signup verification
const signupVerification = catchAsync(async (req, res) => {
  const result = await userService.signupVerification(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Phone number verified successfully.",
    data: result,
  });
});

const resendOTP = catchAsync(async (req, res) => {
  const result = await userService.resendOTP(req.body.phoneNumber);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "OTP resent successfully.",
    data: result,
  });
});

const setPassword = catchAsync(async (req, res) => {
  const { id } = req.user;
  await userService.setPassword(id, req.body.password);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Password set successfully.",
  });
});

const profileSetup = catchAsync(async (req, res) => {
  const { id } = req.user;
  await userService.profileSetup(id, req.body, req.file as Express.Multer.File);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Profile setup successfully.",
  });
});

//get single user
const getSingleUser = catchAsync(async (req, res) => {
  const user = await userService.getSingleUser(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User retrieved successfully",
    data: user,
  });
});

export const UserControllers = {
  createUser,
  signupVerification,
  resendOTP,
  setPassword,
  profileSetup,
  getSingleUser,
};
