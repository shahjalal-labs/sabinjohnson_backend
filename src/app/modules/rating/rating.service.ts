import { Rating } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";

const createRating = async (data: Rating, userId: string) => {
  const existingRide = await prisma.ridesharing.findUnique({
    where: {
      id: data.rideId,
      userId: userId,
      status: "Completed",
    },
  });
  if (!existingRide) {
    throw new ApiError(
      400,
      "You can only rate a ride that you have completed.",
    );
  }

  const existingRating = await prisma.rating.findUnique({
    where: {
      rideId_userId: {
        rideId: data.rideId,
        userId,
      },
    },
  });
  if (existingRating)
    throw new ApiError(400, "You have already rated this ride.");

  await prisma.rating.create({
    data: {
      ...data,
      userId,
      riderId: existingRide.riderId,
    },
  });
  return;
};

const riderReviews = async (riderId: string) => {
  const riderInfo = await prisma.user.findUnique({
    where: { id: riderId },
  });
  if (!riderInfo) throw new ApiError(404, "Rider not found.");

  const reviews = await prisma.rating.findMany({
    where: { riderId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      rating: true,
      comment: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          fullName: true,
          profileImage: true,
        },
      },
    },
  });

  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length ||
    0;
  return {
    rider: {
      id: riderInfo.id,
      fullName: riderInfo.fullName,
      profileImage: riderInfo.profileImage,
      averageRating: Number(averageRating.toFixed(2)),
    },
    reviews,
  };
};

export const ratingServices = {
  createRating,
  riderReviews,
};
