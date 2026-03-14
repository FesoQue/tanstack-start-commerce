import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { apiPost } from "./axios-client";
import { getCartFn } from "#/lib/server/cart";

export type CartItem = {
  productId: number;
  title: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
};

export type Cart = {
  _id?: string;
  userId: string | null;
  items: CartItem[];
  updatedAt: Date | string;
};

const cartApi = {
  get: () => getCartFn(), // Uses a server function — carries session cookies correctly in both SSR and CSR
  post: (body: Record<string, unknown>) => apiPost<Cart>("/api/cart", body),
};

export const cartQuery = queryOptions({
  queryKey: ["cart"],
  queryFn: () => cartApi.get(),
  retry: false,
  throwOnError: false,
});

export const useCart = () => useSuspenseQuery(cartQuery);

export const useAddToCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (item: Omit<CartItem, "quantity">) =>
      cartApi.post({ action: "add", item }),
    onSuccess: (data) => qc.setQueryData(["cart"], data),
  });
};

export const useRemoveFromCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) =>
      cartApi.post({ action: "remove", productId }),
    onSuccess: (data) => qc.setQueryData(["cart"], data),
  });
};

export const useUpdateQuantity = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      quantity,
    }: {
      productId: number;
      quantity: number;
    }) => cartApi.post({ action: "update", productId, quantity }),
    onSuccess: (data) => qc.setQueryData(["cart"], data),
  });
};

export const useClearCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => cartApi.post({ action: "clear" }),
    onSuccess: (data) => qc.setQueryData(["cart"], data),
  });
};

export function getCartTotal(cart: Cart) {
  return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCartCount(cart: Cart) {
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}
