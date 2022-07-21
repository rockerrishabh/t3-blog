import type { GetServerSideProps, NextPage } from "next";
import { unstable_getServerSession } from "next-auth";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import Layout from "../components/Layout";
import { trpc } from "../utils/trpc";
import { authOptions } from "./api/auth/[...nextauth]";

const Home: NextPage = () => {
  const { data: session, status } = useSession();
  const { data, isLoading, error } = trpc.useQuery(["posts.all"]);

  if (status === "loading") {
    <Layout title="Blog">Loading....</Layout>;
  }

  if (isLoading) {
    return <Layout title="- Loading">Loading...</Layout>;
  }

  if (error) {
    return <Layout title="- Page Not Found">Error: {error.message}</Layout>;
  }

  if (data) {
    return (
      <Layout title="" className="max-w-7xl mx-auto">
        <h1 className="mt-5">Recent Posts</h1>
        <div className="grid mt-5 grid-cols-3 gap-6">
          {data.map((post) => (
            <Link href={`/posts/${post.slug}`} key={post.id}>
              <a className="group">
                <article className="border-2 prose lg:prose-xl group-hover:border-red-500 rounded-md p-5">
                  <h4 className="font-semibold group-hover:underline group-hover:text-red-400">
                    {post.title}
                  </h4>
                  <p className="truncate">{post.body}</p>
                </article>
              </a>
            </Link>
          ))}
        </div>
      </Layout>
    );
  }
  return null;
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
