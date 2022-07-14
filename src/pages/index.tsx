import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { trpc } from "../utils/trpc";
import { authOptions } from "./api/auth/[...nextauth]";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const { data, isLoading, error } = trpc.useQuery(["posts.all"]);

  if (status === "loading") {
    <div className="h-screen w-screen items-center justify-center">
      <h1>Loading....</h1>
    </div>;
  }

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        {session ? (
          <>
            <div className="flex justify-between p-5">
              <button
                onClick={() => {
                  signOut();
                }}
              >
                Sign Out
              </button>
              <Link href="/posts/create">Create</Link>
              <Link href="/posts/my">My Posts</Link>
            </div>
            <p>{session.user?.email}</p>
            <p>{session.user?.role}</p>
          </>
        ) : (
          <button
            onClick={() => {
              signIn("google");
            }}
          >
            Sign In
          </button>
        )}
      </div>

      <div className="p-5 flex flex-col space-y-4">
        <h1>Posts</h1>
        {data ? (
          <>
            {data.map((post) => (
              <div
                key={post.id}
                className="rounded-md border hover:border-blue-500 hover:border-2 border-gray-400 p-5"
              >
                <Link href={`/posts/${post.slug}`}>
                  <a>
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>
                  </a>
                </Link>
              </div>
            ))}
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  return {
    props: { session },
  };
};
