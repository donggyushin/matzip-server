"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const routes_1 = __importDefault(require("../routes"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const app = express_1.default();
app.use(express_1.default.json());
app.use(cors_1.default());
app.use(morgan_1.default('common'));
app.use(compression_1.default());
app.use(helmet_1.default());
app.use('/api', routes_1.default);
exports.default = app;
