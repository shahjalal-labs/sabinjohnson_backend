import { labelServices } from "./label.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const createLabel = catchAsync(async (req, res) => {
  await labelServices.createLabel(req.body, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "The label has been created successfully",
  });
});

const myLabels = catchAsync(async (req, res) => {
  const results = await labelServices.myLabels(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "My labels have been retrieved successfully",
    data: results,
  });
});

const updateLabel = catchAsync(async (req, res) => {
  await labelServices.updateLabel(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "label has been updated successfully",
  });
});

const deleteLabel = catchAsync(async (req, res) => {
  await labelServices.deleteLabel(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "label has been deleted successfully",
  });
});

export const labelControllers = {
  createLabel,
  updateLabel,
  deleteLabel,
  myLabels,
};
