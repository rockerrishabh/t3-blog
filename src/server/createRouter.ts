import { router } from "@trpc/server";
import superjson from "superjson";
import type { Context } from "./createContext";

export function createRouter() {
  return router<Context>().transformer(superjson);
}
