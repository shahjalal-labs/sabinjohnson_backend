import express from "express";
import { withdrawalControllers } from "./withdrawal.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.Rider),
  withdrawalControllers.createWithdrawal,
);
router.get("/", withdrawalControllers.getAllWithdrawals);
router.get("/:id", withdrawalControllers.getWithdrawalById);
router.patch("/:id", withdrawalControllers.updateWithdrawal);
router.delete("/:id", withdrawalControllers.deleteWithdrawal);

export const withdrawalRoutes = router;
