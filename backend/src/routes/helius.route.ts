import { Router } from "express";
import { helius } from "../controller/helius.controller.js";

export const heliusRouter = Router();

heliusRouter.post("/", helius);
