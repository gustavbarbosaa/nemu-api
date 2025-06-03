import express, { Request, Response } from "express";
import "dotenv/config";
import journeyController from "./controllers/journey.controller";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(journeyController);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});