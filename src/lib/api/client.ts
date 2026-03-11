import redaxios from "redaxios";

export const client = redaxios.create({
  baseURL: "https://fakestoreapi.com",
  headers: { "Content-Type": "application/json" },
});
