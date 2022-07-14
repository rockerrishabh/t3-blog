import { useForm } from "react-hook-form";
import { trpc } from "../../../utils/trpc";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import toast from "react-hot-toast";
import { EditPostInput } from "../../../server/schema/post.schema";
import { useRouter } from "next/router";
import ErrorPage from "../../404";

function Edit() {
  const router = useRouter();
  const slug = router.query.slug as string;
  const post = trpc.useQuery(["posts.bySlug", { slug }]);
  const utils = trpc.useContext();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EditPostInput>();

  const editPost = trpc.useMutation("posts.edit", {
    async onSuccess() {
      // refetches posts after a post is added
      await utils.invalidateQueries(["posts.all"]);
    },
  });

  const onSubmit = async (data: EditPostInput): Promise<void> => {
    try {
      await editPost.mutateAsync(data);
      toast.success("Successfully Edited");
      reset();
    } catch (error) {
      toast.error("Error while Creating...");
    }
  };

  if (post.status === "loading") {
    return <p>Loading...</p>;
  }

  if (post.status !== "success") {
    return <ErrorPage />;
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-10 space-y-4 justify-center flex-col flex items-center"
      >
        <div className="flex space-x-2">
          <label htmlFor="title">Title: </label>
          <div className="flex flex-col space-y-2">
            <input
              {...register("title", { required: true, maxLength: 256 })}
              className="rounded-md outline-none border border-gray-400 focus:border-0 focus:ring focus:ring-blue-500"
              defaultValue={post.data.title}
              name="title"
              type="text"
            />
            {errors.title?.type === "required" && (
              <span className="text-red-500">This field is required</span>
            )}
            {errors.title?.type === "maxLength" && (
              <span className="text-red-500">Max length is 256</span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <label htmlFor="slug">Slug: </label>
          <div className="flex flex-col space-y-2">
            <input
              {...register("slug", { required: true, maxLength: 256 })}
              className="rounded-md outline-none border border-gray-400 focus:border-0 focus:ring focus:ring-blue-500"
              defaultValue={post.data.slug}
              name="slug"
              type="text"
            />
            {errors.slug?.type === "required" && (
              <span className="text-red-500">This field is required</span>
            )}
            {errors.slug?.type === "maxLength" && (
              <span className="text-red-500">Max length is 256</span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <label htmlFor="featuredImage">Featured Image URL: </label>
          <div className="flex flex-col space-y-2">
            <input
              {...register("featuredImage", { required: true, maxLength: 256 })}
              className="rounded-md outline-none border border-gray-400 focus:border-0 focus:ring focus:ring-blue-500"
              defaultValue={post.data.featuredImage}
              name="featuredImage"
              type="text"
            />
            {errors.featuredImage?.type === "required" && (
              <span className="text-red-500">This field is required</span>
            )}
            {errors.featuredImage?.type === "maxLength" && (
              <span className="text-red-500">Max length is 256</span>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <label htmlFor="body">Body: </label>
          <div className="flex flex-col space-y-2">
            <textarea
              {...register("body", { required: true, minLength: 50 })}
              className="rounded-md outline-none border border-gray-400 focus:border-0 focus:ring focus:ring-blue-500"
              defaultValue={post.data.body}
              name="body"
            />
            {errors.body?.type === "required" && (
              <span className="text-red-500">This field is required</span>
            )}
            {errors.body?.type === "minLength" && (
              <span className="text-red-500">Minimum length is 10</span>
            )}
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Edit;

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
