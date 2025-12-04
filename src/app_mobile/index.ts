import express, { Router } from "express";

import { authMiddleware } from "../core/middleware/auth.middleware";

const promotorRouter: Router = express.Router();

promotorRouter.get("/", authMiddleware, (req, res) => {
  res.status(200).json({
    ok: true,
    message: "Mobile Promotor API is running",
    user: req.user,
  });
});

export default promotorRouter;
