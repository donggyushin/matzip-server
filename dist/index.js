"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app/app"));
const dotenv_1 = __importDefault(require("dotenv"));
const constants_1 = require("./constants/constants");
dotenv_1.default.config();
let PORT = process.env.DEV_PORT || '5000';
switch (constants_1.env) {
    case 'development':
        PORT = process.env.DEV_PORT || '5000';
        break;
    case 'production':
        PORT = process.env.PRD_PORT || '5000';
    default:
        break;
}
app_1.default.listen(PORT, () => {
    console.log(`✅ Matzip server listening at port ${PORT}`);
});
