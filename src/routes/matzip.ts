import express from "express";
import { scrapeMatzipDataFromMNaver } from "../controllers/matzip";

const router = express.Router();

router.get("", scrapeMatzipDataFromMNaver);

export default router;
