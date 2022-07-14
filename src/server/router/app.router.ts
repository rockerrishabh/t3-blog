// src/server/router/index.ts
import { createRouter } from "../createRouter";
import { postsRouter } from "./post.router";
import { authRouter } from "./auth.router";

export const appRouter = createRouter()
  .query("hello", {
    resolve: () => {
      return "Hello frpm TRPC Server.";
    },
  })
  .merge("posts.", postsRouter)
  .merge("auth.", authRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
