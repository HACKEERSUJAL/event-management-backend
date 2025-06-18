import express from "express";
import {
  _deleteEvent,
  createEventController,
  getAllEventController,
  updateEventController,
} from "../controllers/event.controller";
import { upload } from "../middleware/multer";
import { authMiddleware } from "../middleware/auth-user.middleware";

export const eventsRouter = express.Router();

eventsRouter.post("/", upload.single("banner"), createEventController);
eventsRouter.get("/", authMiddleware, getAllEventController);
eventsRouter.put(
  "/:id",
  authMiddleware,
  upload.single("banner"),
  updateEventController
);
eventsRouter.delete("/:id", authMiddleware, _deleteEvent);
