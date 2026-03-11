import { z } from "zod";

const userRegisterValidationSchema = z.object({
  fullName: z.string().min(1, "Full name must be at least 1 characters long"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 characters long"),
});

const verificationSchema = z.object({
  phoneNumber: z.string().min(10, "Phone Number must be at least 10 digits"),
  otp: z.string().min(4, "OTP must be at least 4 characters long"),
});

const resendOTPSchema = z.object({
  phoneNumber: z.string().min(10, "Phone Number must be at least 10 digits"),
});

const setPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const updatePorfileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters long")
    .optional(),

  city: z.string().min(2, "City must be at least 2 characters long").optional(),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters long")
    .optional(),
});

export const userValidation = {
  userRegisterValidationSchema,
  verificationSchema,
  resendOTPSchema,
  setPasswordSchema,
  updatePorfileSchema,
};
