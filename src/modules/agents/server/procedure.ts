import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { resolve } from "path";
import { agentInsertSchema } from "../schemas";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
export const agentRouter=createTRPCRouter({
    getOne:protectedProcedure.input(z.object({id:z.string()})).query (async({input})=>{
        const [existingAgnet] = await db.select({
            ...getTableColumns(agents),
            meetingCount: sql<number>`5`
        }).from(agents).where(eq(agents.id, input.id));
        //await new Promise((resolve)=> setTimeout(resolve,5000));
        
        return existingAgnet;
    }),


    //     z.object({
    //         page:z.number().default(DEFAULT_PAGE),
    //         pageSize:z.number().min(MIN_PAGE_SIZE).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE),
    //         search:z.string().nullish()
    //     })
    // ).query (async({ctx,input})=>{
    //     const {search,page,pageSize} = input;
    //     const data = await db.select({
    //         ...getTableColumns(agents),
    //         meetingCount: sql<number>`8`
    //     }).from(agents)
    //     .where(
    //         and(
    //             eq(agents.userId,ctx.auth.user.id),
    //             search?ilike(agents.name,`%${search}%`):undefined,
    //         )
    //     ).orderBy(desc(agents.createdAt),desc(agents.id)).limit(pageSize).offset((page-1)*pageSize);
    //     //await new Promise((resolve)=> setTimeout(resolve,5000));
    //     const [total] = await db.select({count:count()}).from(agents).where(
    //         and(
    //             eq(agents.userId,ctx.auth.user.id),
    //             search?ilike(agents.name,`%${search}%`):undefined,
    //         )
    //     );
    //     const totalPages = Math.ceil(total.count/pageSize);
        
    //     return {
    //         items:data,
    //         total:total.count,
    //         totalPages
    //     };
    // }),

  //   getMany: protectedProcedure
  // .input(
  //   z.object({
  //     page: z.number().default(DEFAULT_PAGE),
  //     pageSize: z
  //       .number()
  //       .min(MIN_PAGE_SIZE)
  //       .max(MAX_PAGE_SIZE)
  //       .default(MAX_PAGE_SIZE),
  //     search: z.string().nullish(),
  //   }).optional()
  // )
  // .query(async ({ ctx, input }) => {
  //   const page = input?.page ?? DEFAULT_PAGE;
  //   const pageSize = input?.pageSize ?? DEFAULT_PAGE_SIZE;
  //   const search = input?.search;

  //   const data = await db
  //     .select({
  //       ...getTableColumns(agents),
  //       meetingCount: sql<number>`8`,
  //     })
  //     .from(agents)
  //     .where(
  //       and(
  //         eq(agents.userId, ctx.auth.user.id),
  //         search ? ilike(agents.name, `%${search}%`) : undefined
  //       )
  //     )
  //     .orderBy(desc(agents.createdAt), desc(agents.id))
  //     .limit(pageSize)
  //     .offset((page - 1) * pageSize);

  //   const [total] = await db
  //     .select({ count: count() })
  //     .from(agents)
  //     .where(
  //       and(
  //         eq(agents.userId, ctx.auth.user.id),
  //         search ? ilike(agents.name, `%${search}%`) : undefined
  //       )
  //     );

  //   return {
  //     items: data,
  //     total: total.count,
  //     totalPages: Math.ceil(total.count / pageSize),
  //   };
  // }),

  getMany: protectedProcedure
  .input(
    z.object({
      page: z.number().default(DEFAULT_PAGE),
      pageSize: z
        .number()
        .min(MIN_PAGE_SIZE)
        .max(MAX_PAGE_SIZE)
        .default(DEFAULT_PAGE_SIZE), // 👈 single source
      search: z.string().nullish(),
    })
  )
  .query(async ({ ctx, input }) => {
    const { page, pageSize, search } = input;

    const data = await db
      .select({
        ...getTableColumns(agents),
        meetingCount: sql<number>`8`,
      })
      .from(agents)
      .where(
        and(
          eq(agents.userId, ctx.auth.user.id),
          search ? ilike(agents.name, `%${search}%`) : undefined
        )
      )
      .orderBy(desc(agents.createdAt), desc(agents.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    const [total] = await db
      .select({ count: count() })
      .from(agents)
      .where(
        and(
          eq(agents.userId, ctx.auth.user.id),
          search ? ilike(agents.name, `%${search}%`) : undefined
        )
      );

    return {
      items: data,
      total: total.count,
      totalPages: Math.ceil(total.count / pageSize),
    };
  }),



    create:protectedProcedure.input(agentInsertSchema).mutation(async ({input, ctx})=>{
    
        const [createAgent] = await db.insert(agents).values({
            ...input,
          
            userId:ctx.auth.user.id,
        })
        .returning();

        return createAgent;
    })
})