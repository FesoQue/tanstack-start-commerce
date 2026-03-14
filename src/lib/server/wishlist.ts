import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "#/lib/auth";
import { db } from "#/lib/db";
import type { WishlistItem } from "#/lib/api/wishlist";

// MongoDB document shape (updatedAt is a real Date from the DB)
type WishlistDocument = {
  userId: string;
  items: WishlistItem[];
  updatedAt: Date;
};

type SerializedWishlist = {
  _id?: string;
  userId: string | null;
  items: WishlistItem[];
  updatedAt: string;
};

async function getSession() {
  const request = getRequest();
  return auth.api.getSession({ headers: request.headers });
}

function serialize(
  doc: WishlistDocument & { _id?: { toString(): string } }
): SerializedWishlist {
  return {
    _id: doc._id?.toString(),
    userId: doc.userId,
    items: doc.items,
    updatedAt: doc.updatedAt.toISOString(),
  };
}

const emptyWishlist = (userId: string | null): SerializedWishlist => ({
  userId,
  items: [],
  updatedAt: new Date().toISOString(),
});

export const getWishlistFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<SerializedWishlist> => {
    const session = await getSession();
    if (!session) return emptyWishlist(null);

    const doc = await db
      .collection<WishlistDocument>("wishlists")
      .findOne({ userId: session.user.id });

    return doc ? serialize(doc) : emptyWishlist(session.user.id);
  }
);

// Typed wrapper so callers get full type safety at the call site
export type AddToWishlistInput = Omit<WishlistItem, "addedAt">;

export const addToWishlistFn = createServerFn({ method: "POST" }).handler(
  async (ctx): Promise<SerializedWishlist> => {
    const data = (ctx as unknown as { data: AddToWishlistInput }).data;
    const session = await getSession();
    if (!session) return emptyWishlist(null);

    const existing = await db
      .collection<WishlistDocument>("wishlists")
      .findOne({ userId: session.user.id });

    const alreadySaved = existing?.items.some(
      (i) => i.productId === data.productId
    );

    if (!alreadySaved) {
      const newItem: WishlistItem = {
        ...data,
        addedAt: new Date().toISOString(),
      };

      await db.collection<WishlistDocument>("wishlists").updateOne(
        { userId: session.user.id },
        {
          $push: { items: newItem },
          $set: { updatedAt: new Date() },
        },
        { upsert: true }
      );
    }

    const updated = await db
      .collection<WishlistDocument>("wishlists")
      .findOne({ userId: session.user.id });

    return updated ? serialize(updated) : emptyWishlist(session.user.id);
  }
);

export type RemoveFromWishlistInput = { productId: number };

export const removeFromWishlistFn = createServerFn({ method: "POST" }).handler(
  async (ctx): Promise<SerializedWishlist> => {
    const data = (ctx as unknown as { data: RemoveFromWishlistInput }).data;
    const session = await getSession();
    if (!session) return emptyWishlist(null);

    await db.collection<WishlistDocument>("wishlists").updateOne(
      { userId: session.user.id },
      {
        $pull: { items: { productId: data.productId } },
        $set: { updatedAt: new Date() },
      }
    );

    const updated = await db
      .collection<WishlistDocument>("wishlists")
      .findOne({ userId: session.user.id });

    return updated ? serialize(updated) : emptyWishlist(session.user.id);
  }
);

export const clearWishlistFn = createServerFn({ method: "POST" }).handler(
  async (): Promise<SerializedWishlist> => {
    const session = await getSession();
    if (!session) return emptyWishlist(null);

    await db
      .collection<WishlistDocument>("wishlists")
      .updateOne(
        { userId: session.user.id },
        { $set: { items: [], updatedAt: new Date() } }
      );

    return emptyWishlist(session.user.id);
  }
);
