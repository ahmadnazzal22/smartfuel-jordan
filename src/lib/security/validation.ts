import { z } from "zod";

const passwordSchema = z.string()
  .min(12, "Password must be at least 12 characters")
  .max(128, "Password must not exceed 128 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one digit")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
  .refine((v) => !/(.)\1{2,}/.test(v), "Password must not contain repeated characters (3+)");

export const schemas = {
  login: z.object({
    email: z.string().email("Invalid email format").max(255).transform((v) => v.toLowerCase().trim()),
    password: z.string().min(1, "Password is required").max(256),
  }),

  register: z.object({
    email: z.string().email("Invalid email format").max(255).transform((v) => v.toLowerCase().trim()),
    password: passwordSchema,
    name: z.string().min(2, "Name must be at least 2 characters").max(100).trim(),
    role: z.enum(["minister", "owner", "citizen"]).default("citizen"),
    region: z.string().max(100).optional(),
  }),

  refresh: z.object({
    refreshToken: z.string().min(1, "Refresh token is required"),
  }),

  changePassword: z.object({
    currentPassword: z.string().min(1),
    newPassword: passwordSchema,
  }),

  stationCreate: z.object({
    name: z.string().min(2).max(200).trim(),
    region: z.string().min(2).max(100).trim(),
    city: z.string().min(2).max(100).trim(),
    licenseNumber: z.string().regex(/^[A-Z0-9-]+$/, "Invalid license format"),
    capacity: z.number().positive().max(1000000),
    contactPhone: z.string().regex(/^\+?[0-9\s-]{7,20}$/).optional(),
  }),

  truckCreate: z.object({
    plateNumber: z.string().regex(/^[A-Z0-9-]{3,15}$/i, "Invalid plate number"),
    driverName: z.string().min(2).max(100).trim(),
    capacity: z.number().positive().max(100000),
    fuelType: z.enum(["diesel", "octane_90", "octane_95", "kerosene"]),
  }),

  predictionQuery: z.object({
    region: z.string().max(100).optional(),
    fuelType: z.enum(["diesel", "octane_90", "octane_95", "kerosene"]).optional(),
    dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    offset: z.coerce.number().int().min(0).default(0),
  }),

  notifyPatch: z.object({
    id: z.string().uuid("Invalid notification ID"),
  }),
};

export function validate<T>(schema: z.ZodSchema<T>, data: unknown): { data?: T; error?: string } {
  const result = schema.safeParse(data);
  if (!result.success) {
    const first = result.error.errors[0];
    return { error: first?.message || "Validation failed" };
  }
  return { data: result.data };
}

export function sanitize(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}
