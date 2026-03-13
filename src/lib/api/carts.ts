import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  getCartFn,
  addToCartFn,
  removeFromCartFn,
  updateQuantityFn,
  clearCartFn,
} from "../server/cart";
import type { CartItem } from "../server/cart";

export const cartQuery = queryOptions({
  queryKey: ["cart"],
  queryFn: () => getCartFn(),
  retry: false,
  throwOnError: false,
});

export const useCart = () => useSuspenseQuery(cartQuery);

export const useAddToCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (item: Omit<CartItem, "quantity">) =>
      addToCartFn({ data: item }),
    onSuccess: (updatedCart) => {
      qc.setQueryData(["cart"], updatedCart);
    },
  });
};

export const useRemoveFromCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) =>
      removeFromCartFn({ data: { productId } }),
    onSuccess: (updatedCart) => {
      qc.setQueryData(["cart"], updatedCart);
    },
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
    }) => updateQuantityFn({ data: { productId, quantity } }),
    onSuccess: (updatedCart) => {
      qc.setQueryData(["cart"], updatedCart);
    },
  });
};

export const useClearCart = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => clearCartFn(),
    onSuccess: (updatedCart) => {
      qc.setQueryData(["cart"], updatedCart);
    },
  });
};
