import { Ridesharing } from "@prisma/client";
import { calculateDistanceKm } from "../../../helpers/calculateDistance";
import redisClient from "../../../helpers/redis";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";

const findRider = async (payload: {
  pickLatitude: number;
  pickLongitude: number;
  pickupAddress: string;
  destinationLat: number;
  destinationLong: number;
  destinationAddress: string;
  paywith: string;
}) => {
  const radius = 5; // km
  const avgSpeedKmPerHour = 30;
  const avgRatePerKm = 1;

  const riders = await redisClient.georadius(
    "riderLocations",
    payload.pickLongitude,
    payload.pickLatitude,
    radius,
    "km",
    "WITHDIST",
  );

  if (!riders || riders.length === 0) {
    return [];
  }

  // Trip distance (pickup → destination)
  const tripDistanceKm = calculateDistanceKm(
    payload.pickLatitude,
    payload.pickLongitude,
    payload.destinationLat,
    payload.destinationLong,
  );

  const etaMinutes = Math.ceil((tripDistanceKm / avgSpeedKmPerHour) * 60);
  const estimatedFare = Number((tripDistanceKm * avgRatePerKm).toFixed(2));

  const result = await Promise.all(
    riders.map(async (rider: any) => {
      const riderId = rider[0];
      const riderDistanceKm = parseFloat(rider[1]);

      const [riderInfo, vehicleInfo] = await Promise.all([
        prisma.user.findUnique({
          where: { id: riderId },
          select: {
            fullName: true,
            phoneNumber: true,
          },
        }),
        prisma.vehicle.findUnique({
          where: { userId: riderId },
          select: {
            vehicleName: true,
          },
        }),
      ]);

      return {
        riderInfo: {
          id: riderId,
          fullName: riderInfo?.fullName,
          avgRating: 4.5, // Placeholder for average rating
          phoneNumber: riderInfo?.phoneNumber,
        },
        vehicleInfo: {
          vehicleName: vehicleInfo?.vehicleName,
        },
        rideInfo: {
          riderDistanceKm: Number(riderDistanceKm.toFixed(2)), // rider → pickup
          tripDistanceKm: Number(tripDistanceKm.toFixed(2)), // pickup → destination
          etaMinutes,
          estimatedFare,
          payWith: payload.paywith,
        },
        pickup: {
          latitude: payload.pickLatitude,
          longitude: payload.pickLongitude,
          address: payload.pickupAddress,
        },
        destination: {
          latitude: payload.destinationLat,
          longitude: payload.destinationLong,
          address: payload.destinationAddress,
        },
      };
    }),
  );

  return result;
};

const myRideRequests = async (userId: string) => {
  const riderRequests = await prisma.ridesharing.findMany({
    where: {
      riderId: userId,
      status: "Pending",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
        },
      },
      rider: {
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
        },
      },
      pickupAddress: true,
      destinationAddress: true,
      etaMinutes: true,
      userDistanceKm: true,
      cost: true,
      payWith: true,
      createdAt: true,
      status: true,
    },
  });

  return riderRequests;
};

export const sendRequestToRider = async (
  userId: string,
  requestData: Ridesharing,
) => {
  await prisma.ridesharing.create({
    data: {
      ...requestData,
      userId,
    },
  });

  const riderRequests = await prisma.ridesharing.findMany({
    where: {
      riderId: requestData.riderId,
      status: "Pending",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
        },
      },
      rider: {
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
        },
      },
      pickupAddress: true,
      destinationAddress: true,
      etaMinutes: true,
      userDistanceKm: true,
      cost: true,
      payWith: true,
      createdAt: true,
      status: true,
    },
  });

  return riderRequests;
};

export const getRidesharingById = async (id: string) => {
  const rideInfo = await prisma.ridesharing.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      status: true,
      user: {
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
        },
      },
      rider: {
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
        },
      },
      pickupLatitude: true,
      pickupLongitude: true,
      pickupAddress: true,
      destinationLat: true,
      destinationLong: true,
      destinationAddress: true,
      etaMinutes: true,
      cost: true,
      payWith: true,
      createdAt: true,
    },
  });

  return rideInfo;
};

export const approveRequest = async (riderId: string, rideId: string) => {
  await prisma.ridesharing.update({
    where: { id: rideId },
    data: {
      status: "Accepted",
    },
  });

  const ridesharingInfo = await prisma.ridesharing.findMany({
    where: {
      riderId: riderId,
      status: "Pending",
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      user: {
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
        },
      },
      rider: {
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
        },
      },
      pickupAddress: true,
      destinationAddress: true,
      etaMinutes: true,
      userDistanceKm: true,
      cost: true,
      payWith: true,
      createdAt: true,
      status: true,
    },
  });

  return ridesharingInfo;
};

export const currentRide = async (userId: string) => {
  const currentRide = await prisma.ridesharing.findFirst({
    where: {
      userId: userId,
      OR: [{ status: "Accepted" }, { status: "Started" }],
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      rider: {
        select: {
          id: true,
          fullName: true,
          phoneNumber: true,
        },
      },
      pickupLongitude: true,
      pickupAddress: true,
      destinationLat: true,
      destinationLong: true,
      destinationAddress: true,
      etaMinutes: true,
      cost: true,
      payWith: true,
      createdAt: true,
      status: true,
    },
  });

  return currentRide;
};

export const cancelRide = async (
  rideId: string,
  userId: string,
  cancelReason?: string,
) => {
  const rideInfo = await prisma.ridesharing.findUnique({
    where: { id: rideId },
  });
  if (!rideInfo) throw new ApiError(404, "Ride not found");

  const cancelledBy = rideInfo.userId === userId ? "User" : "Rider";

  await prisma.ridesharing.update({
    where: { id: rideId },
    data: {
      status: "Cancelled",
      cancelledBy,
      cancelReason: cancelReason || null,
    },
  });
  return;
};

export const startRide = async (rideId: string) => {
  await prisma.ridesharing.update({
    where: { id: rideId },
    data: {
      status: "Started",
    },
  });
  return;
};

export const endRide = async (rideId: string) => {
  await prisma.ridesharing.update({
    where: { id: rideId },
    data: {
      status: "Completed",
    },
  });
  return;
};

export const ridesharingServices = {
  findRider,
  sendRequestToRider,
  myRideRequests,
  currentRide,
  approveRequest,
  cancelRide,
  startRide,
  endRide,
  getRidesharingById,
};
