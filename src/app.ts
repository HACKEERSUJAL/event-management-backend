import express, { Express, Request, Response } from "express";
import { DBconnection } from "./config/db";
import { userRouter } from "./routes/user.routes";
import { categoryRouter } from "./routes/categories.routes";
import { eventsRouter } from "./routes/events.routes";
import cors from "cors";

const app: Express = express();
const port = 8080;

DBconnection();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api/auth", userRouter);
app.use("/api/cagegory", categoryRouter);
app.use("/api/events", eventsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
