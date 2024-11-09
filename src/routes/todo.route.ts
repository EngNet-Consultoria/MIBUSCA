import { Router } from "express";
import createHttpError from "http-errors";
import { TodoCreateSchema, TodoIdSchema } from "../schemas/todo.schema";
import {
  createTodo,
  deleteTodoById,
  findAllTodo,
  findTodoById,
  updateTodoById,
} from "../repositories/todo.repository";

const router = Router();

router.get("/", async (req, res) => {
  // Validate input
  // Execute business logic
  const todos = await findAllTodo();

  // Send response
  return res.status(200).json(todos);
});

router.get("/:id", async (req, res) => {
  // Validate input
  const id = TodoIdSchema.parse(req.params.id);

  // Execute business logic
  const todo = await findTodoById(id);

  if (todo === null) {
    throw new createHttpError.NotFound("Todo not found");
  }

  // Send response
  return res.status(200).json(todo);
});

router.post("/", async (req, res) => {
  // Validate input
  const { title } = TodoCreateSchema.parse(req.body);

  // Execute business logic
  const todo = await createTodo(title);

  // Send response
  return res.status(201).json(todo);
});

router.put("/:id", async (req, res) => {
  // Validate input
  const id = TodoIdSchema.parse(req.params.id);
  const { title } = TodoCreateSchema.parse(req.body);

  // Execute business logic
  const todo = await updateTodoById(id, title);

  if (todo === null) {
    throw new createHttpError.NotFound("Todo not found");
  }

  // Send response
  return res.status(200).json(todo);
});

router.delete("/:id", async (req, res) => {
  // Validate input
  const id = TodoIdSchema.parse(req.params.id);

  // Execute business logic
  await deleteTodoById(id);

  // Send response
  return res.status(204).json();
});

export default router;
