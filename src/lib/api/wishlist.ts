import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  getWishlistFn,
  addToWishlistFn,
  removeFromWishlistFn,
  clearWishlistFn,
  type AddToWishlistInput,
} from "#/lib/server/wishlist";

export type WishlistItem = {
  productId: number;
  title: string;
  price: number;
  image: string;
  category: string;
  addedAt: string;
};

export type Wishlist = {
  _id?: string;
  userId: string | null;
  items: WishlistItem[];
  updatedAt: string;
};

export const wishlistQuery = queryOptions({
  queryKey: ["wishlist"],
  queryFn: () => getWishlistFn(),
  retry: false,
  throwOnError: false,
});

export const useWishlist = () => useSuspenseQuery(wishlistQuery);

export const useAddToWishlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (item: AddToWishlistInput) =>
      (
        addToWishlistFn as unknown as (opts: {
          data: AddToWishlistInput;
        }) => Promise<Wishlist>
      )({ data: item }),
    onSuccess: (data) => qc.setQueryData(["wishlist"], data),
  });
};

export const useRemoveFromWishlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (productId: number) =>
      (
        removeFromWishlistFn as unknown as (opts: {
          data: { productId: number };
        }) => Promise<Wishlist>
      )({ data: { productId } }),
    onSuccess: (data) => qc.setQueryData(["wishlist"], data),
  });
};

export const useClearWishlist = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => clearWishlistFn(),
    onSuccess: (data) => qc.setQueryData(["wishlist"], data),
  });
};

export const useIsInWishlist = (productId: number) => {
  const { data: wishlist } = useWishlist();
  return wishlist.items.some((i) => i.productId === productId);
};
