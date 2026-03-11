import { Ridesharing } from "@prisma/client";
import { calculateDistanceKm } from "../../../helpers/calculateDistance";
import redisClient from "../../../helpers/redis";
import prisma from "../../../shared/prisma";

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

const sendRequestToRider = async (
  riderId: string,
  requestData: Ridesharing,
) => {
  await redisClient.publish(
    `riderRequest:${riderId}`,
    JSON.stringify(requestData),
  );

  await prisma.ridesharing.create({
    data: requestData,
  });

  return;
};

const getAllRidesharings = async () => {
  return;
};

const getRidesharingById = async (id: string) => {
  return;
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
  getAllRidesharings,
  getRidesharingById,
  updateRidesharing,
  deleteRidesharing,
};
