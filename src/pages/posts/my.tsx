import Link from "next/link";
import { trpc } from "../../utils/trpc";
import ErrorPage from "../404";

function MyPosts() {
  const posts = trpc.useQuery(["posts.get-my-posts"]);
  if (!posts) {
    return <ErrorPage />;
  }
  return (
    <div>
      {posts.data?.map((post) => (
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

export default MyPosts;
