// src/pages/api/trpc/[trpc].ts
import * as trpcNext from "@trpc/server/adapters/next";
import { createNextApiHandler } from "@trpc/server/adapters/next";
import { appRouter } from "../../../server/router/app.router";
import { createContext } from "../../../server/createContext";

// export API handler
export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext,
  onError({ error }) {
    if (error.code === "INTERNAL_SERVER_ERROR") {
      // send to bug reporting
      console.error("Something went wrong", error);
    } else {
      console.error(error);
    }
  },
  /**
   * Enable query batching
   */
  batching: {
    enabled: true,
  },
});
