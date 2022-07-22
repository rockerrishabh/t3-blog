import { Controller, useForm } from "react-hook-form";
import { trpc } from "../../../utils/trpc";
import { GetServerSideProps } from "next";
import { unstable_getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import toast from "react-hot-toast";
import { CreatePostInput } from "../../../server/schema/post.schema";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import { useSession } from "next-auth/react";
import ErrorPage from "../../../components/Error";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";

const SunEditor = dynamic(() => import("suneditor-react"), {
  ssr: false,
});

function Create() {
  const utils = trpc.useContext();
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePostInput>();

  if (status === "loading") {
    return <Layout title="- Create a new Post">Loading...</Layout>;
  }

  if (!session) {
    return (
      <ErrorPage
        errorTitle="- Page Not Found"
        pageError="Please Sign In Before Creating a Post."
      />
    );
  }

  if (session) {
    const addPost = trpc.useMutation("posts.add", {
      async onSuccess() {
        // refetches posts after a post is added
        await utils.invalidateQueries(["posts.all"]);
      },
    });

    const onSubmit = async (data: CreatePostInput): Promise<void> => {
      try {
        await addPost.mutateAsync(data);
        toast.success("Successfully Created");
        reset();
        router.push(`/posts/${data.slug}`);
      } catch (error) {
        toast.error("Error while Creating");
      }
    };
    return (
      <Layout title="- Create a new Post" className="max-w-7xl mx-auto">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 space-y-4 flex-col flex"
        >
          <div className="flex space-x-2">
            <label htmlFor="title">Title: </label>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur } }) => (
                <input
                  onChange={onChange}
                  onBlur={onBlur}
                  className="rounded-md flex-1 outline-none border border-gray-400 focus:border-0 focus:ring focus:ring-blue-500"
                  name="title"
                  type="text"
                />
              )}
              name="title"
              rules={{ required: true }}
            />
          </div>
          <div className="flex space-x-2">
            <label htmlFor="slug">Slug: </label>

            <Controller
              control={control}
              render={({ field: { onChange, onBlur } }) => (
                <input
                  onChange={onChange}
                  onBlur={onBlur}
                  className="rounded-md flex-1 outline-none border border-gray-400 focus:border-0 focus:ring focus:ring-blue-500"
                  name="slug"
                  type="text"
                />
              )}
              name="slug"
              rules={{ required: true }}
            />
          </div>
          <div className="flex space-x-2">
            <label htmlFor="featuredImage">Image: </label>

            <Controller
              control={control}
              render={({ field: { onChange, onBlur } }) => (
                <input
                  onChange={onChange}
                  onBlur={onBlur}
                  className="rounded-md flex-1 outline-none border border-gray-400 focus:border-0 focus:ring focus:ring-blue-500"
                  name="featuredImage"
                  type="text"
                />
              )}
              name="featuredImage"
              rules={{ required: true }}
            />
          </div>
          <div className="flex space-x-2">
            <label htmlFor="body">Body: </label>
            <Controller
              control={control}
              render={({ field: { onChange, onBlur } }) => (
                <SunEditor
                  width="100%"
                  height="100%"
                  onChange={onChange} // send value to hook form
                  onBlur={onBlur} // notify when input is touched
                  setOptions={{
                    height: "100%",
                    width: "100%",

                    attributesWhitelist: {
                      all: "style",
                    },
                    buttonList: [
                      // Default
                      ["undo", "redo"],
                      ["font", "fontSize", "formatBlock"],
                      ["paragraphStyle", "blockquote"],
                      [
                        "bold",
                        "underline",
                        "italic",
                        "strike",
                        "subscript",
                        "superscript",
                      ],
                      ["fontColor", "hiliteColor", "textStyle"],
                      ["removeFormat"],
                      ["outdent", "indent"],
                      ["align", "horizontalRule", "list", "lineHeight"],
                      ["table", "link", "image", "video", "audio"],
                      ["fullScreen", "showBlocks", "codeView"],
                      ["preview", "print"],
                    ], // Or Array of button list, eg. [['font', 'align'], ['image']]
                    // plugins: [font] set plugins, all plugins are set by default
                    // Other option
                    imageFileInput: false,
                  }}
                />
              )}
              name="body"
              rules={{ required: true }}
            />
          </div>
          <button
            className="rounded-md text-white hover:bg-cyan-400 bg-cyan-500 py-3"
            type="submit"
          >
            Submit
          </button>
        </form>
      </Layout>
    );
  }

  return null;
}

export default Create;

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
