import { createServerFn } from "@tanstack/react-start";
import { getHeaders } from "vinxi/http";
import { auth } from "../auth";

export const getSessionFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const headers = getHeaders();

    const session = await auth.api.getSession({
      headers: new Headers(headers as HeadersInit),
    });

    return session;
  }
);
