import { Withdrawal } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";
import axios from "axios";
import config from "../../../config";

const environment = process.env.NODE_ENV;

const base =
  environment === "production"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const clientId = config.paypal.client_id;
  const clientSecret = config.paypal.client_secret;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const url = `${base}/v1/oauth2/token`;

  const { data } = await axios({
    url,
    method: "post",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data: "grant_type=client_credentials",
  });
  return data.access_token;
}

const withdrawalWithCard = async (data: Withdrawal, riderId: string) => {
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

const withdrawalWithPaypal = async (data: Withdrawal, riderId: string) => {
  const riderInfo = await prisma.user.findUnique({ where: { id: riderId } });
  if (!riderInfo) {
    throw new ApiError(404, "Rider not found");
  }
  if (riderInfo.walletBalance < data.amount) {
    throw new ApiError(400, "Insufficient wallet balance");
  }

  const accessToken = await getAccessToken();

  const response = await axios.post(
    `${base}/v1/payments/payouts`,
    {
      sender_batch_header: {
        sender_batch_id: `batch_${Date.now()}`,
        email_subject: "You have a payout!",
      },
      items: [
        {
          recipient_type: "EMAIL",
          amount: {
            value: data.amount.toFixed(2),
            currency: "USD",
          },
          receiver: "sb-vfjex27962074@personal.example.com",
          note: "Payout for your recent withdrawal",
          sender_item_id: `item_${Date.now()}`,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );
  console.log(response.data);

  if (response.status !== 201) {
    throw new ApiError(500, "Failed to process PayPal payout");
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
  withdrawalWithCard,
  withdrawalWithPaypal,
  getAllWithdrawals,
  getWithdrawalById,
  updateWithdrawal,
  deleteWithdrawal,
};
