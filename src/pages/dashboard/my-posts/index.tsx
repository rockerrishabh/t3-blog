import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import { trpc } from "../../../utils/trpc";
import ErrorPage from "../../404";
import { authOptions } from "../../api/auth/[...nextauth]";
import Layout from "../../../components/Layout";
import { useSession } from "next-auth/react";

function MyPosts() {
  const { data: session } = useSession();
  const router = useRouter();
  const { data, isLoading, error } = trpc.useQuery(["posts.my-posts"]);

  if (isLoading) {
    return <Layout title="- My Posts">Loading...</Layout>;
  }

  if (error) {
    return (
      <ErrorPage errorTitle="- Page Not Found" pageError={error.message} />
    );
  }

  if (data) {
    return (
      <Layout title="- My Posts" className="max-w-7xl mx-auto">
        <div className="mt-5 flex items-center justify-between">
          <h1 className="">Post</h1>
          {session && (
            <Link href="/dashboard/my-posts/create">
              <button className="py-2 px-4 bg-cyan-600 text-white hover:bg-cyan-500 rounded-md">
                Create new Post
              </button>
            </Link>
          )}
        </div>
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
