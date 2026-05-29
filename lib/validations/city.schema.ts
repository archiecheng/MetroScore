import { z } from "zod";

export const cityQuerySchema = z.object({
  query: z.string().min(1).max(100).optional(),
});
