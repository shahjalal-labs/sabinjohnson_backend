import * as z from 'zod';

export const createVehicleSchema = z.object({
  // Define fields
  name: z.string(),
});

export const VehicleSchemaValidation = {
createVehicleSchema
};
  