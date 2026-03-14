import * as z from 'zod';

export const createRatingSchema = z.object({
  // Define fields
  name: z.string(),
});

export const RatingSchemaValidation = {
createRatingSchema
};
  