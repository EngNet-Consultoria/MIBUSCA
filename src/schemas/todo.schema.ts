import { z } from "zod";

// Schemas
export const TodoItemSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().max(50),
});

export const TodoCreateSchema = z.object({
  title: z.string().max(50),
});

export const TodoIdSchema = z.coerce.number().int().positive();

// Types
export type TodoItem = z.infer<typeof TodoItemSchema>;
export type TodoCreate = z.infer<typeof TodoCreateSchema>;
export type TodoId = z.infer<typeof TodoIdSchema>;
