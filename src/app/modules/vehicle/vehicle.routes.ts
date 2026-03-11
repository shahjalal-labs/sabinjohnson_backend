import express from "express";
import { vehicleControllers } from "./vehicle.controller";
import auth from "../../middlewares/auth";
import { fileUploader } from "../../../helpers/fileUploader";
import { parseBodyData } from "../../middlewares/parseBodyData";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.Rider, UserRole.Food_Deliver),
  fileUploader.vehicleImage,
  parseBodyData,
  vehicleControllers.createVehicle,
);
router.get("/", vehicleControllers.getAllVehicles);
router.get("/:id", vehicleControllers.getVehicleById);
router.patch(
  "/update",
  auth(UserRole.Rider, UserRole.Food_Deliver),
  fileUploader.uploadMultiple,
  vehicleControllers.updateVehicle,
);
router.delete("/:id", vehicleControllers.deleteVehicle);

export const vehicleRoutes = router;
