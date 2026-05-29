import { z } from "zod";

export const createReportSchema = z.object({
  city1: z.string().min(2, "City 1 is required"),
  city2: z.string().min(2, "City 2 is required"),
  email: z.string().email("A valid email is required"),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;
