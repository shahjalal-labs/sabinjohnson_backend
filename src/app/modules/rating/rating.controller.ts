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

export const ratingControllers = {
  createRating,
  riderReviews,
};
