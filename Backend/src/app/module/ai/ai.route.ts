import { Router } from "express";
import { AIController } from "./ai.controller";

const router = Router();

router.post("/", AIController.postAI);

export const AIRoutes = router;
