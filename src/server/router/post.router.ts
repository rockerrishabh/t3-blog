import { createRouter } from "../createRouter";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  createPostSchema,
  editPostSchema,
  getSinglePostSchema,
  getSinglePostSchemaBySlug,
} from "../schema/post.schema";

const defaultPostSelect = Prisma.validator<
  Prisma.PostsSelect & Prisma.UserArgs
>()({
  id: true,
  title: true,
  body: true,
  slug: true,
  featuredImage: true,
  published: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: {
      name: true,
      email: true,
    },
  },
});

export const postsRouter = createRouter()
  .mutation("add", {
    input: createPostSchema,
    async resolve({ ctx, input }) {
      if (!ctx.session?.user) {
        new TRPCError({
          code: "FORBIDDEN",
          message: "Can not create a post while logged out",
        });
      }
      const post = await ctx.prisma.posts.create({
        data: {
          title: input.title,
          body: input.body,
          slug: input.slug,
          featuredImage: input.featuredImage,
          author: { connect: { id: ctx.session?.user.id } },
        },
        select: defaultPostSelect,
      });
      return post;
    },
  })
  // read
  .query("all", {
    async resolve({ ctx }) {
      /**
       * For pagination you can have a look at this docs site
       * @link https://trpc.io/docs/useInfiniteQuery
       */

      return ctx.prisma.posts.findMany({
        where: {
          published: true,
        },
        select: defaultPostSelect,
        orderBy: {
          updatedAt: "desc",
        },
      });
    },
  })
  .query("bySlug", {
    input: getSinglePostSchemaBySlug,
    async resolve({ ctx, input }) {
      const { slug } = input;
      const post = await ctx.prisma.posts.findUnique({
        where: { slug },
        select: defaultPostSelect,
      });
      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `No post with slug '${slug}'`,
        });
      }
      return post;
    },
  })
  // update
  .mutation("edit", {
    input: editPostSchema,
    async resolve({ ctx, input }) {
      if (!ctx.session?.user) {
        new TRPCError({
          code: "FORBIDDEN",
          message: "Can not edit a post while logged out",
        });
      }
      const { id, title, slug, featuredImage, body } = input;
      const post = await ctx.prisma.posts.update({
        where: { id },
        data: {
          title: title,
          slug: slug,
          featuredImage: featuredImage,
          body: body,
        },
        select: defaultPostSelect,
      });
      return post;
    },
  })
  // delete
  .mutation("delete", {
    input: getSinglePostSchema,
    async resolve({ ctx, input }) {
      if (!ctx.session?.user) {
        new TRPCError({
          code: "FORBIDDEN",
          message: "Can not delete a post while logged out",
        });
      }
      const { id } = input;
      await ctx.prisma.posts.delete({ where: { id } });
      return {
        id,
      };
    },
  })
  .query("get-my-posts", {
    async resolve({ ctx }) {
      if (!ctx.session?.user) {
        new TRPCError({
          code: "FORBIDDEN",
          message: "Can not get your post while logged out",
        });
      }
      const posts = await ctx.prisma.posts.findMany({
        where: { authorId: ctx.session?.user.id },
        select: defaultPostSelect,
      });
      if (posts.length === 0) {
        new TRPCError({ code: "NOT_FOUND", message: "No posts found" });
      }
      if (posts) {
        return posts;
      }
    },
  })
  .mutation("publish-post", {
    input: getSinglePostSchema,
    async resolve({ ctx, input }) {
      if (!ctx.session?.user) {
        new TRPCError({
          code: "FORBIDDEN",
          message: "Can not create a post while logged out",
        });
      }
      const { id } = input;
      const posts = await ctx.prisma.posts.update({
        where: { id },
        data: { published: true },
        select: defaultPostSelect,
      });
      return posts;
    },
  })
  .mutation("unpublish-post", {
    input: getSinglePostSchema,
    async resolve({ ctx, input }) {
      if (!ctx.session?.user) {
        new TRPCError({
          code: "FORBIDDEN",
          message: "Can not create a post while logged out",
        });
      }
      const { id } = input;
      const posts = await ctx.prisma.posts.update({
        where: { id },
        data: { published: false },
        select: defaultPostSelect,
      });
      return posts;
    },
  });
