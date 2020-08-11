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
exports.scrapeMatzipDataBasedOnPage = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
exports.scrapeMatzipDataBasedOnPage = (page, pageNumber, area1Name, area2Name, area3Name) => __awaiter(void 0, void 0, void 0, function* () {
    const matzipList = [];
    const queryString = encodeURI(`${area1Name}${area2Name}${area3Name}맛집`);
    const endPointUrl = `https://store.naver.com/restaurants/list?filterId=r09350103&page=${pageNumber}&query=${queryString}`;
    try {
        yield page.goto(endPointUrl);
        yield page.waitForSelector(".category", { timeout: 10000 });
        const html = yield page.evaluate(() => {
            var _a;
            return (_a = document.querySelector("body")) === null || _a === void 0 ? void 0 : _a.innerHTML;
        });
        const $ = cheerio_1.default.load(html);
        $("ul.list_place_col1 li").map((index, element) => {
            const nameATag = $(element).find("a.name");
            const infoAreaElement = $(element).find("div.info_area");
            const tagsElement = $(element).find("div.tag_area span.item");
            const etcsArea = $(element).find("div.etc_area span.item");
            const thumbnailElement = $(element).find("div.thumb img");
            const title = $(nameATag).find("span").text();
            const description = $(infoAreaElement).find("div.txt").text();
            let review = "";
            let price = "";
            let tags = [];
            const imageUrl = $(thumbnailElement).attr("src");
            tagsElement.map((index, element) => {
                const tag = $(element).text();
                tags.push(tag);
            });
            etcsArea.map((index, element) => {
                if (index === 0) {
                    review = $(element).text();
                }
                else if (index === 1) {
                    price = $(element).text();
                }
            });
            const matzip = {
                title,
                thumbnail: imageUrl,
                description,
                reviewCount: review,
                price,
                tags,
            };
            matzipList.push(matzip);
        });
        return matzipList;
    }
    catch (err) {
        return matzipList;
    }
});
