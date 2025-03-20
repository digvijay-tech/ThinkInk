// root
import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";

// global .env config
dotenv.config();

// express app instance
const app = express();

// express middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("short"));
app.use(helmet());
app.use(cors());

// test route
app.get("/ping", (req, res) => {
    res.status(200).json({
        message: "pong",
    });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log("SERVER START!");
});
