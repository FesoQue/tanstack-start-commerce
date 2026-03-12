import { queryOptions } from "@tanstack/react-query";
import { client } from "./axios-client";

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
};

export const productsApi = {
  getAll: () => client.get<Product[]>("/products").then((r) => r.data),
  getById: (id: number) =>
    client.get<Product>(`/products/${id}`).then((r) => r.data),

  create: (data: Omit<Product, "id">) =>
    client.post<Product>("/products", data).then((r) => r.data),

  update: (id: number, data: Partial<Product>) =>
    client.put<Product>(`/products/${id}`, data).then((r) => r.data),

  delete: (id: number) => client.delete(`/products/${id}`).then((r) => r.data),
};

export const productQueries = {
  all: () =>
    queryOptions({
      queryKey: ["products"],
      queryFn: productsApi.getAll,
    }),

  detail: (id: number) =>
    queryOptions({
      queryKey: ["products", id],
      queryFn: () => productsApi.getById(id),
    }),
};
