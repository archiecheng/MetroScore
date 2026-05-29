import { z } from "zod";

export const checkoutSchema = z.object({
  reportId: z.string().min(1, "reportId is required"),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
