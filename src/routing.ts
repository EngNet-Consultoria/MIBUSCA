import { type Express } from "express";
import todoRoute from "./routes/todo.route";

export default function routing(app: Express) {
  // ! Include your routes here !
  app.use("/todo", todoRoute);
}
