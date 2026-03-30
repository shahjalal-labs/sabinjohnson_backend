import * as z from "zod";

export const createRidesharingSchema = z.object({
  // Define fields
  name: z.string(),
});

const payWithPaypalSchema = z.object({
  orderId: z.string({ required_error: "orderId is required" }).min(1),
});

export const RidesharingSchemaValidation = {
  createRidesharingSchema,
  payWithPaypalSchema,
};
