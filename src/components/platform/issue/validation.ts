import * as z from "zod";

// Define enums for status and priority
export const ISSUE_STATUS = {
  PENDING: "pending",
  STUCK: "stuck",
  IN_PROGRESS: "in_progress",
  DONE: "done",
} as const;

export const ISSUE_PRIORITY = {
  PENDING: "pending",
  HIGH: "high",
  MEDIUM: "medium",
  LOW: "low",
} as const;

export const issueFormSchema = z.object({
  repository: z.string().optional(),
  issue: z.string().min(1, 'العنوان مطلوب'),
  status: z.enum([
    ISSUE_STATUS.PENDING,
    ISSUE_STATUS.STUCK,
    ISSUE_STATUS.IN_PROGRESS,
    ISSUE_STATUS.DONE,
  ]).default(ISSUE_STATUS.PENDING),
  priority: z.enum([
    ISSUE_PRIORITY.PENDING,
    ISSUE_PRIORITY.HIGH,
    ISSUE_PRIORITY.MEDIUM,
    ISSUE_PRIORITY.LOW,
  ]).default(ISSUE_PRIORITY.PENDING),
  duration: z.string().optional().default("4"),
  desc: z.string().min(1, 'الوصف مطلوب'),
  tag: z.string().optional().default(""),
  remark: z.string().optional().default(""),
  club: z.string().optional(),
  label: z.string().optional(),
});

export type IssueFormValues = z.infer<typeof issueFormSchema>;
