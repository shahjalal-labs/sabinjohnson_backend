import { Withdrawal } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";

const createWithdrawal = async (data: Withdrawal, riderId: string) => {
  const riderInfo = await prisma.user.findUnique({ where: { id: riderId } });
  if (!riderInfo) {
    throw new ApiError(404, "Rider not found");
  }
  if (riderInfo.walletBalance < data.amount) {
    throw new ApiError(400, "Insufficient wallet balance");
  }

  await prisma.withdrawal.create({
    data: {
      ...data,
      riderId,
    },
  });

  await prisma.user.update({
    where: { id: riderId },
    data: {
      walletBalance: {
        decrement: data.amount,
      },
    },
  });
  return {
    totalWithdrawn: data.amount,
  };
};

const getAllWithdrawals = async () => {
  const results = await prisma.withdrawal.findMany();
  return results;
};

const getWithdrawalById = async (id: string) => {
  const result = await prisma.withdrawal.findUnique({ where: { id } });
  return result;
};

const updateWithdrawal = async (id: string, data: any) => {
  await prisma.withdrawal.update({ where: { id }, data });
  return;
};

const deleteWithdrawal = async (id: string) => {
  await prisma.withdrawal.delete({ where: { id } });
  return;
};

export const withdrawalServices = {
  createWithdrawal,
  getAllWithdrawals,
  getWithdrawalById,
  updateWithdrawal,
  deleteWithdrawal,
};
