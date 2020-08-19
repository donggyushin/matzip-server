import { MatzipDetailDataTypeM, MenuType } from "../types/types";
import { Request, Response } from "express";
import {
  scrapeMatzipDataBasedOnPage,
  scrapeMatzipDataFromMobilePage,
  scrapeMatzipDetailDataFromMobilePage,
} from "../utils/utils";

import cheerio from "cheerio";
import pupperteer from "puppeteer";

export const scrapeMatzipDetailDataFromMNaver = async (
  req: Request,
  res: Response
) => {
  const { url } = req.query;
  if (!url) {
    return res.status(404).json({
      error: "클라이언트로부터 변수를 제대로 전달받지 못하였습니다.",
    });
  }

  const urlString = url as string;

  const browser = await pupperteer.launch({ headless: true });
  const page = await browser.newPage();

  const matzipDetailData = await scrapeMatzipDetailDataFromMobilePage(
    page,
    urlString
  );
  browser.close();
  return res.json(matzipDetailData);
};

export const scrapeMatzipDataFromMNaver = async (
  req: Request,
  res: Response
) => {
  const { area1Name, area2Name, area3Name, category } = req.query;
  if (!area1Name || !area2Name || !area3Name) {
    return res.status(404).json({
      error: "클라이언트로부터 변수를 제대로 전달받지 못하였습니다.",
    });
  }

  const area1 = area1Name as string;
  const area2 = area2Name as string;
  const area3 = area3Name as string;
  let categoryString = category as string;

  if (!categoryString) {
    categoryString = "맛집";
  }

  try {
    const browser = await pupperteer.launch({ headless: true });
    const page = await browser.newPage();
    const matzipList = await scrapeMatzipDataFromMobilePage(
      page,
      area1,
      area2,
      area3,
      categoryString
    );
    await browser.close();
    return res.json({
      matzipList,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};

export const scrapeMatzipDataFromNaver = async (
  req: Request,
  res: Response
) => {
  const { area1Name, area2Name, area3Name, pageNumber } = req.query;

  if (!area1Name || !area2Name || !area3Name || !pageNumber) {
    return res.status(404).json({
      error: "클라이언트로부터 변수를 제대로 전달받지 못하였습니다.",
    });
  }

  const stringArea1Name = area1Name as string;
  const stringArea2Name = area2Name as string;
  const stringArea3Name = area3Name as string;
  const stringPageNumber = pageNumber as string;

  try {
    const browser = await pupperteer.launch();
    const page = await browser.newPage();
    const matzipList = await scrapeMatzipDataBasedOnPage(
      page,
      stringPageNumber,
      stringArea1Name,
      stringArea2Name,
      stringArea3Name
    );

    browser.close();
    return res.json({
      matzipList,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message,
    });
  }
};
