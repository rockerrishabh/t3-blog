import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Layout from "../../../components/Layout";
import { trpc } from "../../../utils/trpc";
import ErrorPage from "../../404";

function Post() {
  const router = useRouter();
  const slug = router.query.slug as string;
  console.log(router.asPath);
  const { data: session } = useSession();
  const utils = trpc.useContext();
  const { data, isLoading, error } = trpc.useQuery(["posts.bySlug", { slug }]);
  const deletePost = trpc.useMutation("posts.delete", {
    async onSuccess() {
      // refetches posts after a post is added
      await utils.invalidateQueries(["posts.my-posts"]);
      await utils.invalidateQueries(["posts.all"]);
      await utils.invalidateQueries(["posts.bySlug"]);
    },
  });

  const handleDeleteClick = (id: string) => {
    try {
      deletePost.mutateAsync({ id });
      toast.success("Successfully Deleted");
      router.push("/dashboard/my-posts");
    } catch (error) {
      toast.error("Error while Deleting...");
    }
  };

  const publishPost = trpc.useMutation("posts.publish-post", {
    async onSuccess() {
      // refetches posts after a post is added
      await utils.invalidateQueries(["posts.bySlug"]);
      await utils.invalidateQueries(["posts.all"]);
      await utils.invalidateQueries(["posts.my-posts"]);
    },
  });

  const handlePublishClick = (id: string) => {
    try {
      publishPost.mutateAsync({ id });
      toast.success("Successfully Published");
    } catch (error) {
      toast.error("Error while Publishing...");
    }
  };

  const unPublishPost = trpc.useMutation("posts.unpublish-post", {
    async onSuccess() {
      // refetches posts after a post is added
      await utils.invalidateQueries(["posts.bySlug"]);
      await utils.invalidateQueries(["posts.all"]);
      await utils.invalidateQueries(["posts.my-posts"]);
    },
  });

  const handleUnPublishClick = (id: string) => {
    try {
      unPublishPost.mutateAsync({ id });
      toast.success("Successfully Un-Published");
    } catch (error) {
      toast.error("Error while Un-Publishing...");
    }
  };

  if (isLoading) {
    return <Layout title="- Loading">Loading...</Layout>;
  }
  if (error) {
    return (
      <ErrorPage errorTitle="- Page Not Found" pageError={error.message} />
    );
  }

  if (data) {
    return (
      <Layout title={`- ${data.title}`} className="max-w-7xl mx-auto">
        <div className="mt-5 flex items-center justify-between">
          <h1 className="">Post</h1>
          {session && session.user.id === data.authorId && (
            <div className="flex space-x-4">
              <Link href={`/dashboard/my-posts/${data.slug}/edit`}>
                <button className="py-2 px-4 bg-slate-600 text-white hover:bg-slate-500 rounded-md">
                  Edit
                </button>
              </Link>
              {data.published === true ? (
                <button
                  className="py-2 px-4 bg-green-600 text-white hover:bg-green-500 rounded-md"
                  onClick={() => handleUnPublishClick(data.id)}
                >
                  Un-Publish
                </button>
              ) : (
                <button
                  className="py-2 px-4 bg-blue-600 text-white hover:bg-blue-500 rounded-md"
                  onClick={() => handlePublishClick(data.id)}
                >
                  Publish
                </button>
              )}
              <button
                className="py-2 px-4 bg-orange-600 text-white hover:bg-orange-500 rounded-md"
                onClick={() => handleDeleteClick(data.id)}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <article className="space-y-3 prose lg:prose-xl flex flex-col mt-8">
          <h3>{data.title}</h3>
          <p>{data.body}</p>
        </article>
        <div className="mt-14 items-center flex justify-between">
          <div>
            <p className="">By:- {data.author.name}</p>
            {session && <p className="">{data.author.email}</p>}
          </div>
          <em>Date:- {data.updatedAt.toLocaleDateString("en-in")}</em>
        </div>
      </Layout>
    );
  }
  return null;
}

export default Post;
