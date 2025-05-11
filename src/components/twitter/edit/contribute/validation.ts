import { z } from "zod";

export const contributeSchema = z.object({
  contribution: z.string().min(3, { message: "يرجى كتابة مساهمتك" }),
});

export type ContributeSchema = z.infer<typeof contributeSchema>; 