import { mysqlConn } from "../base/mysql";
import { TodoItemSchema, type TodoItem } from "../schemas/todo.schema";

export async function findAllTodo(): Promise<TodoItem[]> {
  const result = await mysqlConn.query("SELECT id, title FROM todo");

  return TodoItemSchema.array().parse(result);
}

export async function findTodoById(id: number): Promise<TodoItem | null> {
  const result = await mysqlConn.query("SELECT id, title FROM todo WHERE id = ?", [id]);

  if (result.length === 0) return null;

  return TodoItemSchema.parse(result[0]);
}

export async function createTodo(title: string): Promise<TodoItem> {
  const insertResult = await mysqlConn.execute("INSERT INTO todo (title) VALUES (?)", [title]);

  const selectResult = await findTodoById(insertResult.insertId);

  if (selectResult === null) throw new Error("Failed to create todo");

  return TodoItemSchema.parse(selectResult);
}

export async function updateTodoById(id: number, title: string): Promise<TodoItem | null> {
  const updateResult = await mysqlConn.execute("UPDATE todo SET title = ? WHERE id = ?", [title, id]);

  if (updateResult.affectedRows === 0) return null;

  const selectResult = await findTodoById(id);

  if (selectResult === null) return null;

  return TodoItemSchema.parse(selectResult);
}

export async function deleteTodoById(id: number): Promise<void> {
  await mysqlConn.execute("DELETE FROM todo WHERE id = ?", [id]);
}
