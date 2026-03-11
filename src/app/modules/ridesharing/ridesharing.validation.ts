import * as z from 'zod';

export const createRidesharingSchema = z.object({
  // Define fields
  name: z.string(),
});

export const RidesharingSchemaValidation = {
createRidesharingSchema
};
  