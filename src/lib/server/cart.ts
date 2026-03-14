import { createServerFn } from "@tanstack/react-start";
import { db } from "#/lib/db";
import type { Cart, CartItem } from "#/lib/api/cart";
import { getSession } from "./session";

export const getCartFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<{
    _id?: string;
    userId: string | null;
    items: CartItem[];
    updatedAt: string;
  }> => {
    const session = await getSession();

    if (!session) {
      return { userId: null, items: [], updatedAt: new Date().toISOString() };
    }

    const cart = await db
      .collection<Cart>("carts")
      .findOne({ userId: session.user.id });

    if (!cart) {
      return {
        userId: session.user.id,
        items: [],
        updatedAt: new Date().toISOString(),
      };
    }

    return {
      _id: cart._id?.toString(),
      userId: cart.userId,
      items: cart.items,
      updatedAt:
        cart.updatedAt instanceof Date
          ? cart.updatedAt.toISOString()
          : String(cart.updatedAt),
    };
  }
);
