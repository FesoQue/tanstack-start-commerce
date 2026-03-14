import { createFileRoute } from "@tanstack/react-router";
import { auth } from "#/lib/auth";
import { db } from "#/lib/db";
import type { Cart, CartItem } from "#/lib/api/cart";

export const Route = createFileRoute("/api/cart")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const session = await auth.api.getSession({
          headers: request.headers,
        });

        if (!session) {
          return Response.json({
            userId: null,
            items: [],
            updatedAt: new Date(),
          });
        }

        const cart = await db.collection<Cart>("carts").findOne({
          userId: session.user.id,
        });

        return Response.json(
          cart ?? {
            userId: session.user.id,
            items: [],
            updatedAt: new Date(),
          }
        );
      },

      POST: async ({ request }) => {
        const session = await auth.api.getSession({
          headers: request.headers,
        });

        if (!session) {
          return Response.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = (await request.json()) as {
          action: "add" | "remove" | "update" | "clear";
          productId?: number;
          quantity?: number;
          item?: Omit<CartItem, "quantity">;
        };

        switch (body.action) {
          case "add": {
            if (!body.item) {
              return Response.json(
                { error: "Item is required for add action" },
                { status: 400 }
              );
            }

            const cart = await db.collection<Cart>("carts").findOne({
              userId: session.user.id,
            });

            const existingItem = cart?.items.find(
              (i) => i.productId === body.item!.productId
            );

            if (existingItem) {
              await db.collection<Cart>("carts").updateOne(
                {
                  userId: session.user.id,
                  "items.productId": body.item.productId,
                },
                {
                  $inc: { "items.$.quantity": 1 },
                  $set: { updatedAt: new Date() },
                }
              );
            } else {
              const newItem: CartItem = {
                productId: body.item.productId,
                title: body.item.title,
                price: body.item.price,
                image: body.item.image,
                category: body.item.category,
                quantity: 1,
              };

              await db.collection<Cart>("carts").updateOne(
                { userId: session.user.id },
                {
                  $push: { items: newItem },
                  $set: { updatedAt: new Date() },
                },
                { upsert: true }
              );
            }
            break;
          }

          case "remove": {
            await db.collection<Cart>("carts").updateOne(
              { userId: session.user.id },
              {
                $pull: { items: { productId: body.productId } },
                $set: { updatedAt: new Date() },
              }
            );
            break;
          }

          case "update": {
            await db.collection<Cart>("carts").updateOne(
              {
                userId: session.user.id,
                "items.productId": body.productId,
              },
              {
                $set: {
                  "items.$.quantity": body.quantity,
                  updatedAt: new Date(),
                },
              }
            );
            break;
          }

          case "clear": {
            await db
              .collection<Cart>("carts")
              .updateOne(
                { userId: session.user.id },
                { $set: { items: [], updatedAt: new Date() } }
              );
            break;
          }

          default:
            return Response.json({ error: "Invalid action" }, { status: 400 });
        }

        const updated = await db.collection<Cart>("carts").findOne({
          userId: session.user.id,
        });

        return Response.json(
          updated ?? {
            userId: session.user.id,
            items: [],
            updatedAt: new Date(),
          }
        );
      },
    },
  },
});
