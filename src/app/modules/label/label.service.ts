import { Label } from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/ApiErrors";

const createLabel = async (data: Label, userId: string) => {
  const existingLabel = await prisma.label.findUnique({
    where: { userId_labelName: { userId, labelName: data.labelName } },
  });
  if (existingLabel)
    throw new ApiError(400, "Label with this name already exists.");

  await prisma.label.create({ data: { ...data, userId } });
  return;
};

const getAllLabels = async () => {
  const results = await prisma.label.findMany();
  return results;
};

const myLabels = async (userId: string) => {
  const results = await prisma.label.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return results;
};

const getLabelById = async (id: string) => {
  const result = await prisma.label.findUnique({ where: { id } });
  return result;
};

const updateLabel = async (id: string, data: Label) => {
  await prisma.label.update({ where: { id }, data });
  return;
};

const deleteLabel = async (id: string) => {
  const existingLabel = await prisma.label.findUnique({ where: { id } });
  if (!existingLabel) throw new ApiError(404, "Label not found.");

  await prisma.label.delete({ where: { id } });
  return;
};

export const labelServices = {
  createLabel,
  getAllLabels,
  getLabelById,
  updateLabel,
  deleteLabel,
  myLabels,
};
