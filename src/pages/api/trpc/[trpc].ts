// src/pages/api/trpc/[trpc].ts
import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/router/app.router";
import { createContext } from "../../../server/createContext";

// export API handler

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ error, type, path, input, ctx, req }) {
    if (error.code === "INTERNAL_SERVER_ERROR") {
      console.error(error.message);
    } else {
      console.error(error.message);
    }
  },
  /**
   * Enable query batching
   */
  batching: {
    enabled: true,
  },
});
