import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import { handleZodError } from "./middlewares/handleZodError.middleware";
import { handleCommonError } from "./middlewares/handleCommonError.middleware";
import routing from "../routing";

const app = express();

// Pre-route middlewares
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
routing(app);

// Post-route middlewares
app.use(handleZodError);
app.use(handleCommonError);

export default app;
