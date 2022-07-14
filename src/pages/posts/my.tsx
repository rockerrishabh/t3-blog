import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { trpc } from "../../utils/trpc";
import ErrorPage from "../404";
import { authOptions } from "../api/auth/[...nextauth]";

function MyPosts() {
  const router = useRouter();
  const posts = trpc.useQuery(["posts.my-posts"]);

  if (posts.status === "loading") {
    return <p>Loading...</p>;
  }

  if (posts.status !== "success") {
    return <ErrorPage />;
  }

  if (posts.data) {
    return (
      <div>
        {posts.data.map((post) => (
          <div key={post.id}>
            <Link href={`/posts/${post.slug}`}>
              <a>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
              </a>
            </Link>
          </div>
        ))}
      </div>
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
