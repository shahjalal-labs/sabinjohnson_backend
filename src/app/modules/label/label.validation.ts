import * as z from 'zod';

export const createLabelSchema = z.object({
  // Define fields
  name: z.string(),
});

export const LabelSchemaValidation = {
createLabelSchema
};
  