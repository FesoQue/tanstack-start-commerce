import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "#/lib/db";
import { ObjectId } from "mongodb";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "../auth";

export type CartItem = {
  productId: number;
  title: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
};

export type Cart = {
  _id?: ObjectId;
  userId: string;
  items: CartItem[];
  updatedAt: Date;
};

async function getSession() {
  const request = getRequest();
  const session = await auth.api.getSession({
    headers: request.headers,
  });
  if (!session) return null;
  return session;
}

export const getCartFn = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const request = getRequest();
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return { userId: null, items: [], updatedAt: new Date() };
    }

    const cart = await db.collection<Cart>("carts").findOne({
      userId: session.user.id,
    });

    if (!cart) {
      return { userId: session.user.id, items: [], updatedAt: new Date() };
    }

    return {
      _id: cart._id?.toHexString(),
      userId: cart.userId,
      items: cart.items,
      updatedAt: cart.updatedAt,
    };
  } catch {
    return { userId: null, items: [], updatedAt: new Date() };
  }
});

export const addToCartFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      productId: z.number(),
      title: z.string(),
      price: z.number(),
      image: z.string(),
      category: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) {
      return { userId: null, items: [], updatedAt: new Date() };
    }

    const cart = await db.collection<Cart>("carts").findOne({
      userId: session.user.id,
    });

    const existingItem = cart?.items.find(
      (i) => i.productId === data.productId
    );

    if (existingItem) {
      // increment quantity if already in cart
      await db.collection<Cart>("carts").updateOne(
        { userId: session.user.id, "items.productId": data.productId },
        {
          $inc: { "items.$.quantity": 1 },
          $set: { updatedAt: new Date() },
        }
      );
    } else {
      // add new item
      await db.collection<Cart>("carts").updateOne(
        { userId: session.user.id },
        {
          $push: {
            items: { ...data, quantity: 1 },
          },
          $set: { updatedAt: new Date() },
        },
        { upsert: true }
      );
    }

    return getCartFn();
  });

export const removeFromCartFn = createServerFn({ method: "POST" })
  .inputValidator(z.object({ productId: z.number() }))
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) {
      return { userId: null, items: [], updatedAt: new Date() };
    }

    await db.collection<Cart>("carts").updateOne(
      { userId: session.user.id },
      {
        $pull: { items: { productId: data.productId } },
        $set: { updatedAt: new Date() },
      }
    );

    return getCartFn();
  });

export const updateQuantityFn = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({ productId: z.number(), quantity: z.number().min(1) })
  )
  .handler(async ({ data }) => {
    const session = await getSession();
    if (!session) {
      return { userId: null, items: [], updatedAt: new Date() };
    }

    await db.collection<Cart>("carts").updateOne(
      { userId: session.user.id, "items.productId": data.productId },
      {
        $set: {
          "items.$.quantity": data.quantity,
          updatedAt: new Date(),
        },
      }
    );

    return getCartFn();
  });

export const clearCartFn = createServerFn({ method: "POST" }).handler(
  async () => {
    const session = await getSession();
    if (!session) {
      return { userId: null, items: [], updatedAt: new Date() };
    }

    await db.collection<Cart>("carts").updateOne(
      { userId: session.user.id },
      {
        $set: { items: [], updatedAt: new Date() },
      }
    );

    return getCartFn();
  }
);

export function getCartTotal(cart: { items: CartItem[] }) {
  return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function getCartCount(cart: { items: CartItem[] }) {
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}
