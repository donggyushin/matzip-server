"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.scrapeMatzipDataFromNaver = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const utils_1 = require("../utils/utils");
exports.scrapeMatzipDataFromNaver = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { area1Name, area2Name, area3Name, pageNumber } = req.query;
    if (!area1Name || !area2Name || !area3Name) {
        return res.status(404).json({
            error: "클라이언트로부터 변수를 제대로 전달받지 못하였습니다. ",
        });
    }
    const stringArea1Name = area1Name;
    const stringArea2Name = area2Name;
    const stringArea3Name = area3Name;
    const stringPageNumber = pageNumber;
    try {
        const browser = yield puppeteer_1.default.launch();
        const page = yield browser.newPage();
        const matzipList = yield utils_1.scrapeMatzipDataBasedOnPage(page, stringPageNumber, stringArea1Name, stringArea2Name, stringArea3Name);
        browser.close();
        return res.json({
            matzipList,
        });
    }
    catch (err) {
        return res.status(500).json({
            error: err.message,
        });
    }
});
