"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const matzip_1 = require("../controllers/matzip");
const router = express_1.default.Router();
router.get("", matzip_1.scrapeMatzipDataFromNaver);
exports.default = router;