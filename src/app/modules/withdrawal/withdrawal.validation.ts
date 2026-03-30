import * as z from 'zod';

export const createWithdrawalSchema = z.object({
  // Define fields
  name: z.string(),
});

export const WithdrawalSchemaValidation = {
createWithdrawalSchema
};
  