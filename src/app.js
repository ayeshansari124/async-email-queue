import express from "express";
import emailRoutes from "./routes/email.routes.js";

const app = express();

app.use(express.json());

app.use("/api", emailRoutes);

app.get("/health", (req, res) => {
  res.json({
    status: "API running",
  });
});

export default app;
