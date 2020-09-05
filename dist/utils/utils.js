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
exports.autoScroll = exports.scrapeMatzipDataBasedOnPage = exports.scrapeMatzipDataFromMobilePage = exports.scrapeMatzipDetailDataFromMobilePage = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
exports.scrapeMatzipDetailDataFromMobilePage = (page, url) => __awaiter(void 0, void 0, void 0, function* () {
    yield page.goto(url);
    yield page.waitForSelector("body", { timeout: 10000 });
    yield autoScrollBody(page);
    const html = yield page.evaluate(() => {
        var _a;
        return (_a = document.querySelector("body")) === null || _a === void 0 ? void 0 : _a.innerHTML;
    });
    const $ = cheerio_1.default.load(html);
    const matzipDetailData = {
        thumbnails: [],
        title1: "",
        title2: "",
        star: "",
        visitorsReview: "",
        blogReview: "",
        phoneString: "",
        address1: "",
        address2: "",
        workTime: "",
        siteUrl: "",
        menus: [],
        visitorsPhotos: [],
        visitorReviews: [],
        blogReviews: [],
        mapUrl: "",
    };
    $("div._3eHVS a.place_thumb").map((index, element) => {
        const div = $(element).find("div");
        const styleString = div.attr("style");
        if (styleString) {
            const thumbnailImage = styleString.substr(44, styleString.length - 45);
            if (thumbnailImage) {
                matzipDetailData.thumbnails.push(thumbnailImage);
            }
        }
    });
    $("span#_title span").map((index, element) => {
        const title = $(element).text();
        if (index === 0) {
            matzipDetailData.title1 = title;
        }
        else if (index === 1) {
            matzipDetailData.title2 = title;
        }
    });
    matzipDetailData.star = $("span._1Y6hi em").text();
    $("span._1Y6hi a").map((index, element) => {
        const review = $(element).text();
        if (index === 0) {
            matzipDetailData.visitorsReview = review;
        }
        else if (index === 1) {
            matzipDetailData.blogReview = review;
        }
    });
    matzipDetailData.phoneString = $("a._3HEBM").attr("href");
    matzipDetailData.address1 = $("div._1h3B_ span._2yqUQ").text();
    matzipDetailData.address2 = $("div._2P6sT").text();
    matzipDetailData.workTime = $("div._2ZP3j").text();
    matzipDetailData.siteUrl = $("a._1RUzg").attr("href");
    $("div.place_section ul._2ohjP li").map((index, element) => {
        const menu = {
            text: "",
            price: "",
            imageUrl: "",
        };
        menu.text = $(element).find("a._3Qe_S").text();
        menu.price = $(element).find("em").text();
        matzipDetailData.menus.push(menu);
    });
    $("ul._3qXio li").map((index, element) => {
        const image = $(element).find("img").attr("src");
        const title = $(element).find("div.H2e-j div").text();
        const price = $(element).find("div._17tyM div").text();
        const menu = {
            imageUrl: image,
            text: title,
            price,
        };
        matzipDetailData.menus.push(menu);
    });
    $("ul._3TiO6 li").map((index, element) => {
        const imageurl = $(element).find("img").attr("src");
        if (imageurl) {
            matzipDetailData.visitorsPhotos.push(imageurl);
        }
    });
    $("ul._1QS0G li").map((index, element) => {
        const star = $(element).find("span._1S6A_").text();
        const review = $(element).find("span.WoYOw").text();
        const profile = $(element).find("img.Yvus5").attr("src");
        const userName = $(element).find("em").text();
        const date = $(element).find("span._2u2Pm").text();
        const reviewObject = {
            star,
            text: review,
            userName,
            userPhoto: profile,
            date,
        };
        matzipDetailData.visitorReviews.push(reviewObject);
    });
    $("ul._1fYfG li").map((index, element) => {
        const title = $(element).find("div._2dj8M div").text();
        const content = $(element).find("div._1X6UX div").text();
        const image = $(element).find("img").attr("src");
        const blogTitle = $(element).find("span._1vuEi").text();
        const date = $(element).find("span._11JOm").text();
        const blogUrl = $(element).find("a").attr("href");
        const blogReview = {
            title,
            blogTitle,
            date,
            description: content,
            thumbnailUrl: image,
            blogUrl,
        };
        matzipDetailData.blogReviews.push(blogReview);
    });
    matzipDetailData.mapUrl = `https://m.place.naver.com${$("a.CSMzW").attr("href")}`;
    return matzipDetailData;
});
exports.scrapeMatzipDataFromMobilePage = (page, area1, area2, area3, category) => __awaiter(void 0, void 0, void 0, function* () {
    const queryString = `${area1} ${area2} ${area3} ${category}`;
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
    $("ul._1l0hl li").map((_, element) => {
        const title = $(element).find("span._2EZQu").text();
        if (!title)
            return;
        const delievery = $(element).find("span._1YOAF").text();
        const description = $(element).find("div._39n9k span").text();
        const detailPageUrl = $(element).find("a.Tx7az").attr("href") || "";
        const category = $(element).find("span._2OOeM").text();
        const hashtags = [];
        const thumbnailUrls = [];
        let star = "";
        let visitorReview = "";
        let blogReview = "";
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
        thumbnailElement.map((_, element) => {
            const url = $(element).find("img").attr("src") || "";
            thumbnailUrls.push(url);
        });
        $(element)
            .find("div._2Fdcp span._1Iweh")
            .map((_, element) => {
            const hashtag = $(element).text();
            hashtags.push(hashtag);
        });
        const matzip = {
            title,
            category,
            delievery,
            description,
            star,
            visitorReview,
            blogReview,
            hashtags,
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
        $("ul.list_place_col1 li").map((_, element) => {
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
            tagsElement.map((_, element) => {
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
function autoScrollBody(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.evaluate(() => __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve, reject) => {
                var totalHeight = 0;
                var distance = 200;
                var timer = setInterval(() => {
                    var scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
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
function autoScroll(page) {
    return __awaiter(this, void 0, void 0, function* () {
        yield page.evaluate(() => __awaiter(this, void 0, void 0, function* () {
            yield new Promise((resolve, _) => {
                var totalHeight = 0;
                var distance = 200;
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
