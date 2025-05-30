// In a new file like src/model/book.model.ts
import { z } from "zod";

export const GetBooksResponseSchema = z.object({
  data: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      author: z.string(),
      year: z.number(),
      category: z.string(),
      createdAt: z.string(),
      updatedAt: z.string(),
    })
  ),
  totalBooks: z.number(),
  resultCode: z.number().optional(),
  errorMessage: z.string().nullable().optional(),
});

// schema for add
export const AddBookRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  year: z.number({ invalid_type_error: "Year must be a number" }).min(1000, "Year seems too old").max(new Date().getFullYear(), "Year cannot be in the future"),
  category: z.string().min(1, "Category is required"),
});

// Schema for the request body of PATCH /template/UpdateBook
export const UpdateBookRequestSchema = z.object({
  id: z.number(),
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  year: z.number({ invalid_type_error: "Year must be a number" }).min(1000).max(new Date().getFullYear()),
  category: z.string().min(1, "Category is required"),
});

export const DeleteBookRequestSchema = z.object({
  id: z.number(),
});

export const OutputBaseSchema = z.object({
  resultCode: z.number().optional(),
  errorMessage: z.string().nullable().optional(),
});