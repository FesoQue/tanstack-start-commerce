import type { Product } from "./products";

export type Cart = {
  id: number;
  userId: number;
  products: Product[];
};
