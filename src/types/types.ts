export type EnvType = "development" | "production";
export type DelieveryType = "배달" | "네이버예약";

export interface MatzipBasicTypeM {
  title: string;
  delievery: string;
  description: string;
  star: string;
  visitorReview: string;
  blogReview: string;
  thumbnailUrls: string[];
}

export interface MatzipBasicType {
  title: string;
  description: string;
  thumbnail?: string;
  reviewCount: string;
  price: string;
  tags: string[];
}
