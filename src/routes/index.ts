import address from "./address";
import express from "express";
import matzip from "./matzip";
const router = express.Router();

router.use("/address", address);
router.use("/matzip", matzip);

export default router;
