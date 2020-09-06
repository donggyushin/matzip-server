export type EnvType = "development" | "production";
export type DelieveryType = "배달" | "네이버예약";

export interface MenuType {
  text: string;
  price: string;
  imageUrl?: string;
}

export interface VisitorReviewType {
  star: string;
  text: string;
  userPhoto?: string;
  userName: string;
  date: string;
}

export interface BlogReviewType {
  title: string;
  description: string;
  thumbnailUrl?: string;
  blogTitle: string;
  date: string;
  blogUrl?: string;
}

export interface MatzipDetailDataTypeM {
  thumbnails: string[];
  title1: string;
  title2: string;
  star: string;
  visitorsReview: string;
  blogReview: string;
  phoneString?: string;
  address1: string;
  address2: string;
  workTime: string[];
  siteUrl?: string;
  menus: MenuType[];
  menuUrl: string;
  visitorsPhotos: string[];
  visitorReviews: VisitorReviewType[];
  blogReviews: BlogReviewType[];
  mapUrl?: string;
}

export interface MatzipBasicTypeM {
  title: string;
  delievery: DelieveryType;
  description: string;
  star: string;
  visitorReview: string;
  blogReview: string;
  thumbnailUrls: string[];
  detailPageUrl: string;
  category: string;
  hashtags: string[];
}

export interface MatzipBasicType {
  title: string;
  description: string;
  thumbnail?: string;
  reviewCount: string;
  price: string;
  tags: string[];
}
