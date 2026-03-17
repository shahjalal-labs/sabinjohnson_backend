import { vehicleServices } from "./vehicle.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const createVehicle = catchAsync(async (req, res) => {
  await vehicleServices.createVehicle(
    req.user.id,
    req.body,
    req.file as Express.Multer.File,
  );
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "The vehicle has been created successfully",
  });
});

const getAllVehicles = catchAsync(async (req, res) => {
  const result = await vehicleServices.getAllVehicles();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All vehicles has been retrived successfully",
    data: result,
  });
});

const getVehicleById = catchAsync(async (req, res) => {
  const result = await vehicleServices.getVehicleById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "vehicle has been retrived successfully",
    data: result,
  });
});

const updateVehicle = catchAsync(async (req, res) => {
  await vehicleServices.updateVehicle(
    req.user.id,
    req.files as { [fieldname: string]: Express.Multer.File[] },
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "vehicle has been updated successfully",
  });
});

const deleteVehicle = catchAsync(async (req, res) => {
  await vehicleServices.deleteVehicle(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "vehicle has been deleted successfully",
  });
});

export const vehicleControllers = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
