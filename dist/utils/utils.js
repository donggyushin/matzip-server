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
exports.autoScroll = exports.scrapeMatzipDataBasedOnPage = exports.scrapeMatzipDataFromMobilePage = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
exports.scrapeMatzipDataFromMobilePage = (page, area1, area2, area3, category) => __awaiter(void 0, void 0, void 0, function* () {
    const queryString = encodeURI(`${area1}${area2}${area3}${category}`);
    const endpointUrl = `https://m.place.naver.com/restaurant/list?query=${queryString}`;
    yield page.goto(endpointUrl);
    yield page.waitForSelector("body", { timeout: 10000 });
    yield autoScroll(page);
    const html = yield page.evaluate(() => {
        var _a;
        return (_a = document.querySelector("body")) === null || _a === void 0 ? void 0 : _a.innerHTML;
    });
    const matzipLists = [];
    const $ = cheerio_1.default.load(html);
    $("ul._1l0hl li").map((index, element) => {
        const title = $(element).find("span._2EZQu").text();
        if (!title)
            return;
        const delievery = $(element).find("span._1YOAF").text();
        const description = $(element).find("div._39n9k span").text();
        const detailPageUrl = $(element).find("a.Tx7az").attr("href") || "";
        const category = $(element).find("span._2OOeM").text();
        let star = "";
        let visitorReview = "";
        let blogReview = "";
        const thumbnailUrls = [];
        const infoElement = $(element).find("div._2vj9H span");
        infoElement.map((index, element) => {
            switch (index) {
                case 0:
                    star = $(element).text();
                    break;
                case 1:
                    visitorReview = $(element).text();
                    break;
                case 2:
                    blogReview = $(element).text();
                    break;
            }
        });
        const thumbnailElement = $(element).find("ul._2Ca7y li");
        thumbnailElement.map((index, element) => {
            const url = $(element).find("img").attr("src") || "";
            thumbnailUrls.push(url);
        });
        const matzip = {
            title,
            category,
            delievery,
            description,
            star,
            visitorReview,
            blogReview,
            thumbnailUrls,
            detailPageUrl: `https://m.place.naver.com${detailPageUrl}`,
        };
        matzipLists.push(matzip);
    });
    return matzipLists;
});
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
function autoScroll(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.evaluate(() => __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 150;
                const scrollable_section = document.getElementById("_list_scroll_container");
                var scrollHeight = scrollable_section.scrollHeight;
                var timer = setInterval(() => {
                    scrollable_section.scrollBy(0, distance);
                    totalHeight += distance;
                    if (totalHeight >= scrollHeight) {
                        clearInterval(timer);
                        resolve();
                    }
                }, 100);
            });
        }));
    });
}
exports.autoScroll = autoScroll;
