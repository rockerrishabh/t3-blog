import z from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1).max(256, "Max title length is 256"),
  body: z.string().min(50),
  slug: z.string().min(1),
  featuredImage: z.string(),
});

export type CreatePostInput = z.TypeOf<typeof createPostSchema>;

export const getSinglePostSchema = z.object({
  id: z.string().cuid(),
});

export type GetSinglePostById = z.TypeOf<typeof getSinglePostSchema>;

export const getSinglePostSchemaBySlug = z.object({
  slug: z.string().min(1),
});

export type GetSinglePostBySlug = z.TypeOf<typeof getSinglePostSchemaBySlug>;

export const editPostSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  slug: z.string(),
  featuredImage: z.string(),
});

export type EditPostInput = z.TypeOf<typeof editPostSchema>;
