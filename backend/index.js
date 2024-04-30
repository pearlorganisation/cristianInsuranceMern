import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import chalk from "chalk";
import connectDB from "./src/configs/db.js";

const app = express();
const PORT = 8000 || process.env.PORT;

// @@Desc:-----Handling uncaught Exception-----------------
process.on("uncaughtException", (err) => {
  console.log(err);
  console.log(`Error: ${err.message}`);
  console.log(`shutting down the server for handling uncaught exception`);
});

// @@desc---MIDDLEWARES-----------------
dotenv.config();
app.use(
  cors(
    process.env.NODE_ENV === "production"
      ? {
          origin: ["http://localhost:3000"],
          credentials: true,
        }
      : {
          origin: ["http://localhost:3000"],
          methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
          allowedHeaders: ["Content-Type", "Authorization", "x-csrf-token"],
          credentials: true,
          maxAge: 600,
          exposedHeaders: ["*", "Authorization"],
        }
  )
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//@@desc-------Routes-------------

import blogRoutes from "./src/routes/blog.js";
import faqRoutes from "./src/routes/faq.js";
import { error } from "./src/middlewares/error.js";

app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/faq", faqRoutes);
app.use(error);

app.use("/", () => {
  res.send("Welcome!!");
});

app.listen(PORT, () => {
  connectDB();
  console.log(chalk.yellow.underline.bold(`LISTENING TO PORT-${PORT}`));
});

//@@DESC:--------------unhandled promise rejection
process.on("unhandledRejection", (err) => {
  console.log(err);
  console.log(chalk.red.bold(`Shutting down the server for ${err.message}`));

  console.log(
    chalk.red.bold(`shutting down the server for unhandle promise rejection`)
  );

  server.close(() => {
    process.exit(1);
  });
});