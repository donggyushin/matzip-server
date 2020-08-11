import { Browser, Page } from "puppeteer";

import { MatzipBasicType } from "../types/types";
import cheerio from "cheerio";

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
