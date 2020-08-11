import { EnvType } from "../types/types";
import dotenv from "dotenv";
dotenv.config();

export const env: EnvType = (process.env.NODE_ENV as EnvType) || "production";
