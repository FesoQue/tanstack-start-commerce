export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

export type Cart = {
  id: number;
  userId: number;
  products: Product[];
};

export type User = {
  id: number;
  username: string;
  email: string;
  password: string;
};
