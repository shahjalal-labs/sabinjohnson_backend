import { withdrawalServices } from "./withdrawal.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const createWithdrawal = catchAsync(async (req, res) => {
  const response = await withdrawalServices.createWithdrawal(
    req.body,
    req.user.id,
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "The withdrawal has been created successfully",
    data: response,
  });
});

const getAllWithdrawals = catchAsync(async (req, res) => {
  const result = await withdrawalServices.getAllWithdrawals();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All withdrawals has been retrived successfully",
    data: result,
  });
});

const getWithdrawalById = catchAsync(async (req, res) => {
  const result = await withdrawalServices.getWithdrawalById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "withdrawal has been retrived successfully",
    data: result,
  });
});

const updateWithdrawal = catchAsync(async (req, res) => {
  await withdrawalServices.updateWithdrawal(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "withdrawal has been updated successfully",
  });
});

const deleteWithdrawal = catchAsync(async (req, res) => {
  await withdrawalServices.deleteWithdrawal(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "withdrawal has been deleted successfully",
  });
});

export const withdrawalControllers = {
  createWithdrawal,
  getAllWithdrawals,
  getWithdrawalById,
  updateWithdrawal,
  deleteWithdrawal,
};
