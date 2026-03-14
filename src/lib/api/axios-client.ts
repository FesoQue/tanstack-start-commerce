import redaxios from "redaxios";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return import.meta.env.VITE_APP_URL ?? "http://localhost:3000";
};

// Shared default headers
const defaultHeaders = { "Content-Type": "application/json" };

// External API client (e.g. fakestoreapi.com)
export const client = redaxios.create({
  baseURL: "https://fakestoreapi.com",
  headers: defaultHeaders,
});

// Internal API client for local server endpoints.
// baseURL is resolved lazily via apiGet/apiPost so it works correctly in both SSR and browser.
export const apiClient = redaxios.create({
  headers: defaultHeaders,
});

// Intercept responses on the internal client to normalise error shapes.
(apiClient as any).interceptors?.response?.use(
  (res: unknown) => res,
  (err: any) => {
    // Expose HTTP status directly on the error for consistent handling
    if (err?.response?.status) {
      err.status = err.response.status;
    }

    if (import.meta.env.DEV) {
      console.error(
        `[apiClient] ${err?.config?.method?.toUpperCase()} ${err?.config?.url} →`,
        err.status ?? err.message
      );
    }

    return Promise.reject(err);
  }
);

/** Make an authenticated GET request to a local API route. */
export const apiGet = <T>(path: string) =>
  apiClient.get<T>(`${getBaseUrl()}${path}`).then((r) => r.data);

/** Make an authenticated POST request to a local API route. */
export const apiPost = <T>(path: string, body?: unknown) =>
  apiClient.post<T>(`${getBaseUrl()}${path}`, body).then((r) => r.data);

/** Factory for one-off clients with a custom base URL. */
export const createClient = (baseURL: string) =>
  redaxios.create({ baseURL, headers: defaultHeaders });
