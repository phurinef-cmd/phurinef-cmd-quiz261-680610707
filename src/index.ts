import express, { type Request, type Response } from "express";
import morgan from "morgan";

import usersRoutes from "./routes/usersRoutes";
import itemsRoutes from "./routes/itemsRoutes";

const app = express();
const port = 3000;

// Middlewares
app.use(express.json());
app.use(morgan("dev"));

// Root
app.get("/", (req: Request, res: Response) => {
  res.send("Quiz #2 - API service");
});

// ข้อมูลนักศึกษา
app.get("/studentInfo", (req: Request, res: Response) => {
  res.status(200).json({
    studentId: "680610707",
    firstname: "Phurin",
    lastname: "Bansupa",
    section: "001",
  });
});

// Routes
app.use("/api/v707", usersRoutes);
app.use("/api/v707", itemsRoutes);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});

export default app;