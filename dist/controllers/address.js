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
exports.getAddressFromGeoLocation = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.getAddressFromGeoLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { longitude, latitude } = req.query;
    const naverApiQueryKey = process.env.NAVER_API_KEY_QUERIES || "";
    const requestEndpoint = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=${longitude},${latitude}&orders=legalcode,admcode,addr,roadaddr&output=json&${naverApiQueryKey}`;
    if (!longitude || !latitude) {
        return res.status(400).json({
            error: "클라이언트로부터 변수를 제대로 전달받지 못하였습니다.",
        });
    }
    try {
        const response = yield axios_1.default.get(requestEndpoint);
        const data = response.data;
        const { area1, area2, area3 } = data.results[0].region;
        const area1Name = area1.name;
        const area2Name = area2.name;
        const area3Name = area3.name;
        return res.json({
            area1Name,
            area2Name,
            area3Name,
        });
    }
    catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
});
