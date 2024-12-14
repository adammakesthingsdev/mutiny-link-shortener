import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { env } from "@/env";

export const linkRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    const links = ctx.db.link.findMany();
    return links;
  }),

  get: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const link = await ctx.db.link.findUnique({ where: { id: input.id } });
      return link;
    }),

  create: publicProcedure
    .input(z.object({ apiKey: z.string(), href: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const id = Math.random().toString(16).slice(2, 8);
      if (input.apiKey != env.ADMIN_API_KEY) {
        return null;
      }
      await ctx.db.link.create({ data: { href: input.href, id: id } });
      return id;
    }),
});
