import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { trpc } from "../utils/trpc";
import ErrorPage from "./404";
import { authOptions } from "./api/auth/[...nextauth]";
import Layout from "../components/Layout";
import { useSession } from "next-auth/react";

function MyPosts() {
  const { data: session } = useSession();
  const router = useRouter();
  const { data, isLoading, error } = trpc.useQuery(["posts.my-posts"]);

  if (isLoading) {
    return <Layout>Loading...</Layout>;
  }

  if (error) {
    return <ErrorPage />;
  }

  if (data) {
    return (
      <Layout title="Blog - My Posts" className="max-w-7xl mx-auto">
        <div className="mt-8 flex items-center justify-between">
          <h1 className="">Post</h1>
          {session && (
            <div className="flex space-x-4">
              <Link href="/posts/create">
                <button className="py-2 px-4 bg-cyan-600 text-white hover:bg-cyan-500 rounded-md">
                  Create new Post
                </button>
              </Link>
            </div>
          )}
        </div>
        <div className="grid mt-5 grid-cols-3 gap-6">
          {data.map((post) => (
            <Link href={`/posts/${post.slug}`} key={post.id}>
              <a>
                <article className="border-2 prose lg:prose-xl hover:border-red-500 rounded-md p-5">
                  <h4 className="font-semibold hover:underline hover:text-red-400">
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
}

export default MyPosts;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: { session },
  };
};
