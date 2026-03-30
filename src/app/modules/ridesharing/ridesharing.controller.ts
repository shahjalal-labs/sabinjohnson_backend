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
  await ridesharingServices.sendRequestToRider(req.user.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Request has been sent to rider successfully",
  });
});

const myRideRequests = catchAsync(async (req, res) => {
  const result = await ridesharingServices.myRideRequests(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "My ride requests have been retrieved successfully",
    data: result,
  });
});

const currentRide = catchAsync(async (req, res) => {
  const result = await ridesharingServices.currentRide(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Current ride has been retrieved successfully",
    data: result,
  });
});

const cancelRide = catchAsync(async (req, res) => {
  const result = await ridesharingServices.cancelRide(
    req.params.rideId,
    req.user.id,
    req.body.cancelReason,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Ride has been cancelled successfully",
    data: result,
  });
});

const startRide = catchAsync(async (req, res) => {
  await ridesharingServices.startRide(req.params.rideId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Ride has been started successfully",
  });
});

const endRide = catchAsync(async (req, res) => {
  await ridesharingServices.endRide(req.params.rideId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Ride has been completed successfully",
  });
});

const payWithBepay = catchAsync(async (req, res) => {
  await ridesharingServices.payWithBepay(req.params.rideId, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "BePay payment has been processed successfully",
  });
});

const cashPayment = catchAsync(async (req, res) => {
  await ridesharingServices.cashPayment(req.params.rideId, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Cash payment has been processed successfully",
  });
});

const payWithCard = catchAsync(async (req, res) => {
  await ridesharingServices.payWithCard(
    req.params.rideId,
    req.user.id,
    req.body.paymentMethodId,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Card payment has been processed successfully",
  });
});

const payWithPaypal = catchAsync(async (req, res) => {
  const data = await ridesharingServices.payWithPaypal(
    req.params.rideId,
    req.user.id,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "PayPal payment has been processed successfully",
    data,
  });
});

const getRidesharingById = catchAsync(async (req, res) => {
  const result = await ridesharingServices.getRidesharingById(
    req.params.rideId,
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "ridesharing has been retrived successfully",
    data: result,
  });
});

const myRideHistory = catchAsync(async (req, res) => {
  const result = await ridesharingServices.myRideHistory(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "My ride history has been retrieved successfully",
    data: result,
  });
});
const myWalletHistory = catchAsync(async (req, res) => {
  const result = await ridesharingServices.myWalletHistory(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "My wallet history has been retrieved successfully",
    data: result,
  });
});

export const ridesharingControllers = {
  findRider,
  sendRequestToRider,
  myRideRequests,
  currentRide,
  cancelRide,
  startRide,
  endRide,
  payWithBepay,
  cashPayment,
  payWithCard,
  payWithPaypal,
  getRidesharingById,
  myRideHistory,
  myWalletHistory,
};
