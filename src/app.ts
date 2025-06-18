import express, { Express, Request, Response } from "express";
import { DBconnection } from "./config/db";
import { userRouter } from "./routes/user.routes";
import { categoryRouter } from "./routes/categories.routes";
import { eventsRouter } from "./routes/events.routes";

const app: Express = express();
const port = 8080;

DBconnection();
app.use(express.json());
app.use("/api/auth", userRouter);
app.use("/api/cagegory", categoryRouter);
app.use("/api/events",eventsRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
