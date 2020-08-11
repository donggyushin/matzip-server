import { Request, Response } from "express";

import pupperteer from "puppeteer";
import { scrapeMatzipDataBasedOnPage } from "../utils/utils";

export const scrapeMatzipDataFromNaver = async (
  req: Request,
  res: Response
) => {
  const { area1Name, area2Name, area3Name, pageNumber } = req.query;

  if (!area1Name || !area2Name || !area3Name) {
    return res.status(404).json({
      error: "클라이언트로부터 변수를 제대로 전달받지 못하였습니다. ",
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
