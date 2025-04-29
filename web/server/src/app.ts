import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";

// modules
import authRouter from "./routes/auth.routes";
import modelRouter from "./routes/ai-model.routes";
import transactionRouter from "./routes/transaction.routes";

// express app instance
const app = express();

// express middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("short"));
app.use(helmet());
app.use(cors());

app.use("/api", authRouter);
app.use("/api", modelRouter);
app.use("/api", transactionRouter);

export default app;
