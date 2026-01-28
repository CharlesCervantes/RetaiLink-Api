import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import {
  responseLogger,
  errorHandler,
  notFoundHandler,
} from "./core/middleware/error.middleware";


import adminRouter from "./app_admin/index";
import superadminRouter from "./app_superadmin/index";

dotenv.config();
const app: Express = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(responseLogger);

app.use("/retailink-api/superadmin", superadminRouter);
app.use("/retailink-api/admin", adminRouter);
app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  try {

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`API is accessible at http://localhost:${PORT}`);
      console.log(`Local network access: http://[TU_IP_LOCAL]:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
