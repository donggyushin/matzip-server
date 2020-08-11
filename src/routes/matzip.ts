import express from "express";
import { scrapeMatzipDataFromNaver } from "../controllers/matzip";
const router = express.Router();

router.get("", scrapeMatzipDataFromNaver);

export default router;
