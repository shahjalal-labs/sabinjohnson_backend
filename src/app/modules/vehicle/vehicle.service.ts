import { Vehicle } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { uploadInSpace } from "../../../helpers/uploadInSpace";
import ApiError from "../../../errors/ApiErrors";

const createVehicle = async (
  userId: string,
  data: Vehicle,
  file: Express.Multer.File,
) => {
  const existingVehicle = await prisma.vehicle.findUnique({
    where: { userId },
  });
  if (existingVehicle)
    throw new ApiError(400, "A vehicle already exists for this user.");

  if (file) {
    const imageUrl = await uploadInSpace(file, "vehicleImages");
    data.licenseFrontImage = imageUrl;
  }
  await prisma.vehicle.create({
    data: {
      ...data,
      userId,
    },
  });
  return;
};

const getAllVehicles = async () => {
  const results = await prisma.vehicle.findMany();
  return results;
};

const getVehicleById = async (id: string) => {
  const result = await prisma.vehicle.findUnique({ where: { id } });
  return result;
};

const updateVehicle = async (
  userId: string,
  files: { [fieldname: string]: Express.Multer.File[] },
) => {
  const processImages = async (files?: Express.Multer.File[]) => {
    if (!files || files.length === 0) return [];
    return Promise.all(
      files.map((file) => uploadInSpace(file, "vehicles/documents")),
    );
  };

  const takeIdFrontImage = files?.["idFrontImage"] || [];
  const takeIdBackImage = files?.["idBackImage"] || [];
  const takeLicenseFrontImage = files?.["licenseFrontImage"] || [];
  const takeLicenseBackImage = files?.["licenseBackImage"] || [];

  const idFrontImage =
    takeIdFrontImage.length > 0 ? await processImages(takeIdFrontImage) : [];
  const idBackImage =
    takeIdBackImage.length > 0 ? await processImages(takeIdBackImage) : [];
  const licenseFrontImage =
    takeLicenseFrontImage.length > 0
      ? await processImages(takeLicenseFrontImage)
      : [];
  const licenseBackImage =
    takeLicenseBackImage.length > 0
      ? await processImages(takeLicenseBackImage)
      : [];

  await prisma.vehicle.update({
    where: { userId: userId },
    data: {
      idFrontImage: idFrontImage.length > 0 ? idFrontImage[0] : undefined,
      idBackImage: idBackImage.length > 0 ? idBackImage[0] : undefined,
      licenseFrontImage:
        licenseFrontImage.length > 0 ? licenseFrontImage[0] : undefined,
      licenseBackImage:
        licenseBackImage.length > 0 ? licenseBackImage[0] : undefined,
    },
  });
  return;
};

const deleteVehicle = async (id: string) => {
  await prisma.vehicle.delete({ where: { id } });
  return;
};

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
};
