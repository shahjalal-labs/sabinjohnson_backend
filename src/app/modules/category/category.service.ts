import { Category } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { uploadInSpace } from "../../../helpers/uploadInSpace";
import ApiError from "../../../errors/ApiErrors";

const createCategory = async (data: Category, file: Express.Multer.File) => {
  const existingCategory = await prisma.category.findUnique({
    where: { categoryName: data.categoryName },
  });
  if (existingCategory) {
    throw new Error("Category with this name already exists.");
  }

  if (file === undefined) {
    throw new ApiError(
      400,
      "Thumbnail image is required for category creation.",
    );
  }

  const thumbnail = await uploadInSpace(file, "CategoryThumbnails");

  await prisma.category.create({
    data: {
      ...data,
      thumbnail,
    },
  });
  return;
};

const getAllCategorys = async () => {
  const results = await prisma.category.findMany();
  return results;
};

const getCategoryById = async (id: string) => {
  const result = await prisma.category.findUnique({ where: { id } });
  if (!result) {
    throw new ApiError(404, "Category not found.");
  }
  return result;
};

const updateCategory = async (
  id: string,
  data: Category,
  file?: Express.Multer.File,
) => {
  const existingCategory = await prisma.category.findUnique({ where: { id } });
  if (!existingCategory) {
    throw new ApiError(404, "Category not found.");
  }
  const thumbnail = file
    ? await uploadInSpace(file, "CategoryThumbnails")
    : existingCategory.thumbnail;

  await prisma.category.update({
    where: { id },
    data: {
      ...data,
      thumbnail,
    },
  });
  return;
};

const deleteCategory = async (id: string) => {
  const existingCategory = await prisma.category.findUnique({ where: { id } });
  if (!existingCategory) {
    throw new ApiError(404, "Category not found.");
  }

  await prisma.category.delete({ where: { id } });
  return;
};

export const categoryServices = {
  createCategory,
  getAllCategorys,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
