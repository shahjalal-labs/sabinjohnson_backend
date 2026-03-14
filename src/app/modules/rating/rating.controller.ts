import { ratingServices } from "./rating.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const createRating = catchAsync(async (req, res) => {
  await ratingServices.createRating(req.body, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "The rating has been created successfully",
  });
});

const riderReviews = catchAsync(async (req, res) => {
  const reviews = await ratingServices.riderReviews(req.params.riderId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Rider reviews retrieved successfully",
    data: reviews,
  });
});

const getAllRatings = catchAsync(async (req, res) => {
  const result = await ratingServices.getAllRatings();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "All ratings has been retrived successfully",
    data: result,
  });
});

const getRatingById = catchAsync(async (req, res) => {
  const result = await ratingServices.getRatingById(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "rating has been retrived successfully",
    data: result,
  });
});

const updateRating = catchAsync(async (req, res) => {
  await ratingServices.updateRating(req.params.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "rating has been updated successfully",
  });
});

const deleteRating = catchAsync(async (req, res) => {
  await ratingServices.deleteRating(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "rating has been deleted successfully",
  });
});

export const ratingControllers = {
  createRating,
  riderReviews,
  getAllRatings,
  getRatingById,
  updateRating,
  deleteRating,
};
