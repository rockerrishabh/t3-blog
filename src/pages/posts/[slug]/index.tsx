import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { GetSinglePostById } from "../../../server/schema/post.schema";
import { trpc } from "../../../utils/trpc";
import ErrorPage from "../../404";

function Post() {
  const router = useRouter();
  const { data: session } = useSession();
  const utils = trpc.useContext();
  const slug = router.query.slug as string;
  const post = trpc.useQuery(["posts.bySlug", { slug }]);
  const editPost = trpc.useMutation("posts.delete", {
    async onSuccess() {
      // refetches posts after a post is added
      await utils.invalidateQueries(["posts.all"]);
    },
  });

  const handleDeleteClick = (id: string) => {
    try {
      editPost.mutateAsync({ id });
      toast.success("Successfully Deleted");
      router.back();
    } catch (error) {
      toast.error("Error while Deleting...");
    }
  };

  const publishPost = trpc.useMutation("posts.publish-post", {
    async onSuccess() {
      // refetches posts after a post is added
      await utils.invalidateQueries(["posts.all"]);
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
      await utils.invalidateQueries(["posts.all"]);
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

  if (post.status === "loading") {
    return <p>Loading...</p>;
  }
  if (post.status !== "success") {
    return <ErrorPage />;
  }

  if (post.data) {
    return (
      <div className="p-5 flex flex-col space-y-4">
        <Head>
          <title>{`T3 Blog - ${post.data.title}`}</title>
          <meta name="description" content="Generated by create-t3-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex flex-col space-y-3">
          <h1 className="hover:underline underline-offset-3 cursor-pointer">
            {post.data?.title}
          </h1>
          <p>{post.data?.body}</p>
        </div>
        <div className="flex items-center justify-between">
          <p>{post.data?.author.email}</p>
          <div className="flex flex-col space-y-2">
            <p>{post.data?.author.name}</p>
            <em>Created at {post.data?.createdAt.toLocaleString("en-in")}</em>
            {session && (
              <div className="space-x-4 flex">
                {session.user.email === post.data?.author.email && (
                  <>
                    {post.data?.published === true ? (
                      <button
                        onClick={() => {
                          handleUnPublishClick(post.data?.id);
                        }}
                      >
                        Un-Publish
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          handlePublishClick(post.data?.id);
                        }}
                      >
                        Publish
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleDeleteClick(post.data?.id);
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default Post;
