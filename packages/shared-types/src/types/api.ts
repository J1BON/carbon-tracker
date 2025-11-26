import { z } from "zod";

export const ApiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z
    .object({
      message: z.string(),
      code: z.string().optional(),
      details: z.any().optional(),
    })
    .optional(),
});

export type ApiResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code?: string;
    details?: any;
  };
};

export const PaginationSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  total: z.number().int().min(0),
  total_pages: z.number().int().min(0),
});

export type Pagination = z.infer<typeof PaginationSchema>;

export const PaginatedResponseSchema = z.object({
  items: z.array(z.any()),
  pagination: PaginationSchema,
});

export type PaginatedResponse<T = any> = {
  items: T[];
  pagination: Pagination;
};

