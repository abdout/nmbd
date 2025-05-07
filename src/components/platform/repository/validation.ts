import { z } from "zod";

const repositorySchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  desc: z.string().min(1, "Description is required").max(1000, "Description is too long"),
  club: z.string().min(1, "Club is required"),
  status: z.string().min(1, "Status is required"),
  readme: z.string().optional(),
  roadmap: z.string().optional(),
  contributor: z.string().optional(),
  material: z.string().optional(),
  chat: z.string().optional(),
});

const partialRepositorySchema = repositorySchema.partial();

export type RepositoryInput = z.infer<typeof repositorySchema>;
export type PartialRepositoryInput = z.infer<typeof partialRepositorySchema>;

export function validateRepository(data: Partial<RepositoryInput>, isPartial = false) {
  try {
    const schema = isPartial ? partialRepositorySchema : repositorySchema;
    const validData = schema.parse(data);
    return {
      success: true,
      data: validData,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0].message,
      };
    }
    return {
      success: false,
      error: "Invalid repository data",
    };
  }
}
