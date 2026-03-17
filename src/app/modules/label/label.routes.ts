import express from "express";
import { labelControllers } from "./label.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post("/", auth(UserRole.User), labelControllers.createLabel);
router.get("/my-labels", auth(UserRole.User), labelControllers.myLabels);
router.patch("/:id", auth(UserRole.User), labelControllers.updateLabel);
router.delete("/:id", auth(UserRole.User), labelControllers.deleteLabel);

export const labelRoutes = router;
