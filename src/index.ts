import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express, { Response } from "express";
import morgan from "morgan";
import "reflect-metadata";
import { createConnection } from "typeorm";
import trim from "./middlewares/trim";
import authRoutes from "./routes/auth";
import miscRoutes from "./routes/misc";
import postRoutes from "./routes/posts";
import subRoutes from "./routes/subs";
import userRoutes from "./routes/users";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(trim);
app.use(express.static("public"));

app.get("/", (_, res: Response) => res.status(200).send("Hello World!"));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/subs", subRoutes);
app.use("/api/misc", miscRoutes);
app.use("/api/users", userRoutes);

app.listen(process.env.PORT, async () => {
  console.log(`Server is running at http://localhost:${process.env.PORT}`);

  try {
    await createConnection();
    console.log("Database connected");
  } catch (err) {
    console.error(err);
  }
});
