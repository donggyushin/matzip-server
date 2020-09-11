import { Request, Response } from "express";

import axios from "axios";
import dotenv from "dotenv";
import { env } from "process";

dotenv.config();

export const getAddressFromGeoLocation = async (
  req: Request,
  res: Response
) => {
  const { longitude, latitude } = req.query;
  const naverApiQueryKey = process.env.NAVER_API_KEY_QUERIES || "";
  const requestEndpoint = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?request=coordsToaddr&coords=${longitude},${latitude}&orders=legalcode,admcode,addr,roadaddr&output=json`;
  if (!longitude || !latitude) {
    return res.status(400).json({
      error: "클라이언트로부터 변수를 제대로 전달받지 못하였습니다.",
    });
  }
  try {
    const response = await axios.get(requestEndpoint, {
      headers: {
        "X-NCP-APIGW-API-KEY-ID": process.env.NAVER_API_CLIENT_KEY,
        "X-NCP-APIGW-API-KEY": process.env.NAVER_API_SECRET_KEY,
      },
    });
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
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
};
