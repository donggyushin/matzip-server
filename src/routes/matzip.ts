import {
  scrapeMatzipDataFromMNaver,
  scrapeMatzipDetailDataFromMNaver,
} from "../controllers/matzip";

import express from "express";

const router = express.Router();

router.get("", scrapeMatzipDataFromMNaver);
router.get("/detail", scrapeMatzipDetailDataFromMNaver);

export default router;
