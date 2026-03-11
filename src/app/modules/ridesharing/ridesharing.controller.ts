import { ridesharingServices } from "./ridesharing.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const findRider = catchAsync(async (req, res) => {
  const data = await ridesharingServices.findRider(req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Riders has been found successfully",
    data,
  });
});

const sendRequestToRider = catchAsync(async (req, res) => {
  await ridesharingServices.sendRequestToRider(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Request has been sent to rider successfully",
  });
});

const getAllRidesharings = catchAsync(async (req, res) => {
  const result = await ridesharingServices.getAllRidesharings();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All ridesharings has been retrived successfully",
    data: result,
  });
});

const getRidesharingById = catchAsync(async (req, res) => {
  const result = await ridesharingServices.getRidesharingById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "ridesharing has been retrived successfully",
    data: result,
  });
});

const updateRidesharing = catchAsync(async (req, res) => {
  await ridesharingServices.updateRidesharing(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "ridesharing has been updated successfully",
  });
});

const deleteRidesharing = catchAsync(async (req, res) => {
  await ridesharingServices.deleteRidesharing(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "ridesharing has been deleted successfully",
  });
});

export const ridesharingControllers = {
  findRider,
  sendRequestToRider,
  getAllRidesharings,
  getRidesharingById,
  updateRidesharing,
  deleteRidesharing,
};
