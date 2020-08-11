"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const address_1 = __importDefault(require("./address"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.use('/address', address_1.default);
exports.default = router;
