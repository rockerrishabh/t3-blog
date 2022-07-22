import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Link from "next/link";
import { trpc } from "../../../utils/trpc";
import { authOptions } from "../../api/auth/[...nextauth]";
import Layout from "../../../components/Layout";
import { useSession } from "next-auth/react";
import Image from "next/image";
import ErrorPage from "../../../components/Error";

function MyPosts() {
  const { data: session } = useSession();

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
        <div className="mt-5 mb-10 grid grid-cols-2 gap-5">
          {data.map((post) => (
            <div key={post.id} className="group">
              <article className="border p-5 group-hover:border-gray-600">
                <div className="flex flex-col space-y-10">
                  <div className="flex flex-col space-y-3">
                    <Link href={`/posts/${post.slug}`} key={post.id}>
                      <a className="font-medium text-lg line-clamp-2 group-hover:underline group-hover:text-red-400">
                        {post.title}
                      </a>
                    </Link>
                    <p className="line-clamp-3 text-slate-500">{post.body}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex cursor-pointer space-x-2 items-center">
                      <Image
                        className="rounded-full"
                        src={post.author.image as string}
                        height="30px"
                        width="30px"
                        alt={post.author.name as string}
                      />
                      <p className="text-sm">{post.author.name}</p>
                    </div>
                    <p className="text-sm">
                      {post.updatedAt.toLocaleDateString("en-in")}
                    </p>
                  </div>
                </div>
              </article>
            </div>
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
