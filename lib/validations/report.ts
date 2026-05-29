import { z } from "zod";

/** Used by the marketing compare form. */
export const createReportSchema = z.object({
  city1: z.string().min(2, "City 1 is required"),
  city2: z.string().min(2, "City 2 is required"),
  email: z.email("A valid email is required"),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;

/** Used by POST /api/v1/reports. */
export const createReportApiSchema = z
  .object({
    cityAId: z.string().min(1, "cityAId is required"),
    cityBId: z.string().min(1, "cityBId is required"),
    purpose: z.enum([
      "move",
      "primary_home",
      "rental_investment",
      "long_term_investment",
    ]),
    buyerEmail: z.email().optional(),
  })
  .refine((d) => d.cityAId !== d.cityBId, {
    message: "cityAId and cityBId must be different",
    path: ["cityBId"],
  });

export type CreateReportApiInput = z.infer<typeof createReportApiSchema>;
