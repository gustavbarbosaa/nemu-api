import { Request, Response, Router } from "express";
import { SheetsService } from "../services/sheets.service";
import { ProccessDataService } from "../services/proccessData.service";
import { iTouchpoint } from "../models/touchpoint";

const router = Router();
const sheetsService = new SheetsService();
const processDataService = new ProccessDataService();

router.get("/journeys", async (req: Request, res: Response) => {
  try {
    const touchpoints: iTouchpoint[] = await sheetsService.fetchRawTouchpoints();
    const groupedTouchpoints = processDataService.groupTouchpointsBySessionId(touchpoints);
    res.status(200).json(groupedTouchpoints);
  } catch (error) {
    console.error("Error fetching journeys:", error);
    res.status(500).json({ error: "Failed to fetch journeys" });
  }
});

export default router;