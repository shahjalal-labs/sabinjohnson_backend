import express from "express";
import { userRoutes } from "../modules/user/user.route";
import { authRoute } from "../modules/auth/auth.routes";
import { vehicleRoutes } from "../modules/vehicle/vehicle.routes";
import { ridesharingRoutes } from "../modules/ridesharing/ridesharing.routes";
import { ratingRoutes } from "../modules/rating/rating.routes";
import { labelRoutes } from "../modules/label/label.routes";
import { categoryRoutes } from "../modules/category/category.routes";

const router = express.Router();

const moduleRoutes = [
  { path: "/user", route: userRoutes },
  { path: "/auth", route: authRoute },
  { path: "/vehicle", route: vehicleRoutes },
  { path: "/ride-sharing", route: ridesharingRoutes },
  { path: "/rating", route: ratingRoutes },
  { path: "/label", route: labelRoutes },
  { path: "/category", route: categoryRoutes },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
