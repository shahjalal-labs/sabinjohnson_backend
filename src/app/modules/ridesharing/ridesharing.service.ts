import { OrderType, Ridesharing } from "@prisma/client";
import { calculateDistanceKm } from "../../../helpers/calculateDistance";
import redisClient from "../../../helpers/redis";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import { startOfWeek, endOfWeek, endOfMonth, startOfMonth } from "date-fns";

const findRider = async (payload: {
  pickLatitude: number;
  pickLongitude: number;
  pickupAddress: string;
  destinationLat: number;
  destinationLong: number;
  destinationAddress: string;
  paywith: string;
  orderType: OrderType;
  orderId?: string;
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
        orderInfo: {
          orderType: payload.orderType || OrderType.Ridesharing,
          orderId: payload.orderId,
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

const payWithBepay = async (rideId: string, userId: string) => {
  const rideInfo = await prisma.ridesharing.findUnique({
    where: { id: rideId },
  });
  if (!rideInfo) throw new ApiError(404, "Ride not found");
  if (rideInfo.userId !== userId) throw new ApiError(403, "Unauthorized");

  await prisma.$transaction(async (tx) => {
    await tx.ridesharing.update({
      where: { id: rideId },
      data: {
        status: "Paid",
      },
    });

    await tx.payment.create({
      data: {
        userId,
        amount: rideInfo.cost,
        method: "BePay",
        rideId,
        riderId: rideInfo.riderId,
      },
    });

    await tx.user.update({
      where: { id: rideInfo.riderId },
      data: {
        walletBalance: {
          increment: rideInfo.cost,
        },
      },
    });
  });

  return;
};

const cashPayment = async (rideId: string, userId: string) => {
  const rideInfo = await prisma.ridesharing.findUnique({
    where: { id: rideId },
  });
  if (!rideInfo) throw new ApiError(404, "Ride not found");
  if (rideInfo.userId !== userId) throw new ApiError(403, "Unauthorized");

  await prisma.$transaction(async (tx) => {
    await tx.ridesharing.update({
      where: { id: rideId },
      data: {
        status: "Paid",
      },
    });

    await tx.payment.create({
      data: {
        userId,
        amount: rideInfo.cost,
        method: "Cash",
        rideId,
        riderId: rideInfo.riderId,
      },
    });
  });

  return;
};

const payWithCard = async (rideId: string, userId: string) => {
  const rideInfo = await prisma.ridesharing.findUnique({
    where: { id: rideId },
  });
  if (!rideInfo) throw new ApiError(404, "Ride not found");
  if (rideInfo.userId !== userId) throw new ApiError(403, "Unauthorized");

  await prisma.$transaction(async (tx) => {
    await tx.ridesharing.update({
      where: { id: rideId },
      data: {
        status: "Paid",
      },
    });

    await tx.payment.create({
      data: {
        userId,
        amount: rideInfo.cost,
        method: "Card",
        rideId,
        riderId: rideInfo.riderId,
      },
    });

    await tx.user.update({
      where: { id: rideInfo.riderId },
      data: {
        walletBalance: {
          increment: rideInfo.cost,
        },
      },
    });
  });

  return;
};

const payWithPaypal = async (rideId: string, userId: string) => {
  const rideInfo = await prisma.ridesharing.findUnique({
    where: { id: rideId },
  });
  if (!rideInfo) throw new ApiError(404, "Ride not found");
  if (rideInfo.userId !== userId) throw new ApiError(403, "Unauthorized");

  await prisma.$transaction(async (tx) => {
    await tx.ridesharing.update({
      where: { id: rideId },
      data: {
        status: "Paid",
      },
    });

    await tx.payment.create({
      data: {
        userId,
        amount: rideInfo.cost,
        method: "PayPal",
        rideId,
        riderId: rideInfo.riderId,
      },
    });

    await tx.user.update({
      where: { id: rideInfo.riderId },
      data: {
        walletBalance: {
          increment: rideInfo.cost,
        },
      },
    });
  });

  return;
};

const myRideHistory = async (userId: string) => {
  const rideHistory = await prisma.ridesharing.findMany({
    where: {
      userId: userId,
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
          profileImage: true,
          riderRatings: true,
        },
      },
      pickupAddress: true,
      destinationAddress: true,
      cost: true,
      payWith: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const rideHistoriesWithRatings = await Promise.all(
    rideHistory.map(async (ride) => {
      const ratings = ride.rider.riderRatings;
      const averageRating =
        ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length || 0;

      return {
        ...ride,
        rider: {
          id: ride.rider.id,
          fullName: ride.rider.fullName,
          profileImage: ride.rider.profileImage,
          averageRating: Number(averageRating.toFixed(2)),
        },
      };
    }),
  );

  return rideHistoriesWithRatings;
};

const myWalletHistory = async (userId: string) => {
  const userInfo = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!userInfo) throw new ApiError(404, "User not found");

  const now = new Date();

  const startMonth = startOfMonth(now);
  const endMonth = endOfMonth(now);
  const startWeek = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const endWeek = endOfWeek(now, { weekStartsOn: 1 }); // Sunday

  const lastOneMonthPayments = await prisma.payment.findMany({
    where: {
      riderId: userId,
      status: "Completed",
      createdAt: {
        gte: startMonth,
        lte: endMonth,
      },
    },
  });

  const lastWeekPayments = await prisma.payment.findMany({
    where: {
      riderId: userId,
      status: "Completed",
      createdAt: {
        gte: startWeek,
        lte: endWeek,
      },
    },
  });

  const rideCount = await prisma.ridesharing.count({
    where: {
      riderId: userId,
      OR: [{ status: "Completed" }, { status: "Paid" }],
    },
  });

  const weekDaysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const daysMap: Record<string, number> = {
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  };

  lastWeekPayments.forEach((p) => {
    const day = new Date(p.createdAt).toLocaleDateString("en-US", {
      weekday: "short",
    });

    daysMap[day] += p.amount;
  });

  const lastWeekEarnings = weekDaysOrder.map((day) => ({
    day,
    amount: daysMap[day],
  }));

  const withdrawalHistory = await prisma.withdrawal.findMany({
    where: {
      riderId: userId,
    },
    select: {
      id: true,
      amount: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    rideCount,
    walletBalance: userInfo.walletBalance,
    lastOneMonthEarnings: lastOneMonthPayments.reduce(
      (sum, p) => sum + p.amount,
      0,
    ),
    lastWeekEarnings,
    withdrawalHistory,
  };
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
  payWithBepay,
  cashPayment,
  payWithCard,
  payWithPaypal,
  getRidesharingById,
  myRideHistory,
  myWalletHistory,
};
