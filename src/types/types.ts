export type EnvType = "development" | "production";

export interface MatzipBasicType {
  title: string;
  description: string;
  thumbnail?: string;
  reviewCount: string;
  price: string;
  tags: string[];
}
