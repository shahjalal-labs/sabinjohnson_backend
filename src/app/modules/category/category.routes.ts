import express from "express";
import { categoryControllers } from "./category.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { fileUploader } from "../../../helpers/fileUploader";
import { parseBodyData } from "../../middlewares/parseBodyData";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.Admin),
  fileUploader.thumbnail,
  parseBodyData,
  categoryControllers.createCategory,
);
router.get("/all-categories", categoryControllers.getAllCategorys);
router.get("/single-category/:id", categoryControllers.getCategoryById);
router.patch(
  "/:id",
  auth(UserRole.Admin),
  fileUploader.thumbnail,
  parseBodyData,
  categoryControllers.updateCategory,
);
router.delete("/:id", auth(UserRole.Admin), categoryControllers.deleteCategory);

export const categoryRoutes = router;
