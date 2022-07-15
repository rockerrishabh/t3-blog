// src/pages/_app.tsx
import { withTRPC } from "@trpc/next";
import type { AppRouter } from "../server/router/app.router";
import type { AppType } from "next/dist/shared/lib/utils";
import superjson from "superjson";
import { SessionProvider } from "next-auth/react";
import "../styles/globals.css";
import { Toaster } from "react-hot-toast";

const baseURL = process.env.NEXT_PUBLIC_VERCEL_URL
  ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  : "http://localhost:3000";

const MyApp: AppType = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Toaster />
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default withTRPC<AppRouter>({
  config({ ctx }) {
    /**
     * If you want to use SSR, you need to use the server's full URL
     * @link https://trpc.io/docs/ssr
     */

    const url = `${baseURL}/api/trpc`;

    const ONE_DAY_SECONDS = 24 * 60 * 60;

    ctx?.res?.setHeader(
      "Cache-Control",
      `s-maxage=1, stale-while-revalidate=${ONE_DAY_SECONDS}`
    );

    return {
      url,
      transformer: superjson,
      /**
       * @link https://react-query.tanstack.com/reference/QueryClient
       */
      queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
      headers() {
        if (ctx?.req) {
          return {
            ...ctx.req.headers,
            "x-ssr": "1",
          };
        }
        return {};
      },
    };
  },

  /**
   * @link https://trpc.io/docs/ssr
   */
  ssr: true,
})(MyApp);
