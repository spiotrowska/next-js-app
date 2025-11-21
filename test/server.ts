// Minimal MSW server setup; extend with handlers as needed.
// For MSW v2 in a Node (Jest) environment, use 'msw/node' for setupServer and 'msw' for request handlers.
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/health", () => HttpResponse.json({ status: "ok" })),
];

export const server = setupServer(...handlers);
