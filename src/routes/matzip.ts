import {
  scrapeMatzipDataFromMNaver,
  scrapeMatzipDataFromNaver,
} from "../controllers/matzip";

import express from "express";
const router = express.Router();

router.get("", scrapeMatzipDataFromMNaver);

export default router;
