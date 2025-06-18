import express from "express";
import {
  getUserController,
  loginController,
  updateUserController,
  userController,
} from "../controllers/auth-user.controller";
import { upload } from "../middleware/multer";
export const userRouter = express.Router();

userRouter.post("/register", upload.single("avatar"), userController);
userRouter.put("/:id", updateUserController);
userRouter.get("/", getUserController);
userRouter.post("/login", loginController);
