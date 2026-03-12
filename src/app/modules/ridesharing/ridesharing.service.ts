import { Ridesharing } from "@prisma/client";
import { calculateDistanceKm } from "../../../helpers/calculateDistance";
import redisClient from "../../../helpers/redis";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";

const findRider = async (payload: {
  pickLatitude: number;
  pickLongitude: number;
  destinationLat: number;
  destinationLong: number;
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
        id: riderId,
        fullName: riderInfo?.fullName,
        phoneNumber: riderInfo?.phoneNumber,
        vehicleName: vehicleInfo?.vehicleName,

        riderDistanceKm: Number(riderDistanceKm.toFixed(2)), // rider → pickup
        tripDistanceKm: Number(tripDistanceKm.toFixed(2)), // pickup → destination

        etaMinutes,
        estimatedFare,

        payWith: payload.paywith,
        pickup: {
          latitude: payload.pickLatitude,
          longitude: payload.pickLongitude,
        },
        destination: {
          latitude: payload.destinationLat,
          longitude: payload.destinationLong,
        },
      };
    }),
  );

  return result;
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

export const approveRequest = async (
  riderId: string,
  requestData: Ridesharing,
) => {
  await prisma.ridesharing.update({
    where: { id: requestData.id },
    data: {
      status: "Accepted",
    },
  });

  const ridesharingInfo = await prisma.ridesharing.findMany({
    where: {
      riderId: riderId,
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
      status: "Accepted",
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
      pickupAddress: true,
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
  const rideInfo = await prisma.ridesharing.findUnique({
    where: { id: rideId },
  });
  if (!rideInfo) throw new ApiError(404, "Ride not found");

  await prisma.ridesharing.update({
    where: { id: rideId },
    data: {
      status: "Started",
    },
  });
  return;
};

export const endRide = async (rideId: string) => {
  const rideInfo = await prisma.ridesharing.findUnique({
    where: { id: rideId },
  });
  if (!rideInfo) throw new ApiError(404, "Ride not found");

  await prisma.ridesharing.update({
    where: { id: rideId },
    data: {
      status: "Completed",
    },
  });
  return;
};

const getAllRidesharings = async () => {
  return;
};

export const getRidesharingById = async (id: string) => {
  const rideInfo = await prisma.ridesharing.findUnique({
    where: {
      id,
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
      cost: true,
      payWith: true,
      createdAt: true,
      status: true,
    },
  });
  return rideInfo;
};

const updateRidesharing = async (id: string, data: any) => {
  return;
};

const deleteRidesharing = async (id: string) => {
  return;
};

export const ridesharingServices = {
  findRider,
  sendRequestToRider,
  currentRide,
  approveRequest,
  cancelRide,
  startRide,
  endRide,
  getAllRidesharings,
  getRidesharingById,
  updateRidesharing,
  deleteRidesharing,
};
