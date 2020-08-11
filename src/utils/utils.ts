import { Browser, Page } from "puppeteer";
import { MatzipBasicType, MatzipBasicTypeM } from "../types/types";

import cheerio from "cheerio";

export const scrapeMatzipDataFromMobilePage = async (
  page: Page,
  area1: string,
  area2: string,
  area3: string,
  category: string
): Promise<MatzipBasicTypeM[]> => {
  const queryString = encodeURI(`${area1}${area2}${area3}${category}`);
  const endpointUrl = `https://m.place.naver.com/restaurant/list?query=${queryString}`;
  await page.goto(endpointUrl);
  await page.waitForSelector("body", { timeout: 10000 });
  await autoScroll(page);
  const html: any = await page.evaluate(() => {
    return document.querySelector("body")?.innerHTML;
  });

  const matzipLists: MatzipBasicTypeM[] = [];

  const $ = cheerio.load(html);
  $("ul._1l0hl li").map((index, element) => {
    const title = $(element).find("span._2EZQu").text();
    if (!title) return;
    const delievery = $(element).find("span._1YOAF").text();
    const description = $(element).find("div._39n9k span").text();
    const detailPageUrl = $(element).find("a.Tx7az").attr("href") || "";
    const category = $(element).find("span._2OOeM").text();
    const hashtags: string[] = [];

    let star = "";
    let visitorReview = "";
    let blogReview = "";
    const thumbnailUrls: string[] = [];

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

    $(element)
      .find("div._2Fdcp span._1Iweh")
      .map((index, element) => {
        const hashtag = $(element).text();
        hashtags.push(hashtag);
      });

    const matzip: MatzipBasicTypeM = {
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
};

export const scrapeMatzipDataBasedOnPage = async (
  page: Page,
  pageNumber: string,
  area1Name: string,
  area2Name: string,
  area3Name: string
): Promise<MatzipBasicType[]> => {
  const matzipList: MatzipBasicType[] = [];
  const queryString = encodeURI(`${area1Name}${area2Name}${area3Name}맛집`);
  const endPointUrl = `https://store.naver.com/restaurants/list?filterId=r09350103&page=${pageNumber}&query=${queryString}`;
  try {
    await page.goto(endPointUrl);
    await page.waitForSelector(".category", { timeout: 10000 });
    const html: any = await page.evaluate(() => {
      return document.querySelector("body")?.innerHTML;
    });
    const $ = cheerio.load(html);
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
      let tags: string[] = [];
      const imageUrl = $(thumbnailElement).attr("src");

      tagsElement.map((index, element) => {
        const tag = $(element).text();
        tags.push(tag);
      });

      etcsArea.map((index, element) => {
        if (index === 0) {
          review = $(element).text();
        } else if (index === 1) {
          price = $(element).text();
        }
      });

      const matzip: MatzipBasicType = {
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
  } catch (err) {
    return matzipList;
  }
};

export async function autoScroll(page: Page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 150;
      const scrollable_section = document.getElementById(
        "_list_scroll_container"
      ) as HTMLElement;
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
  });
}
