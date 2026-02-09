import { db } from "@/db";
import { agents, meetings } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { and, count, desc, eq, getTableColumns, ilike, sql } from "drizzle-orm";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE } from "@/constants";
import { meetingInsertSchema, meetingUpdateSchema } from "../schemas";
import { MeetingStatus } from "../types";

export const meetingRouter = createTRPCRouter({
     update:protectedProcedure
      .input(meetingUpdateSchema )
      .mutation(async({input,ctx})=>{
        const [updatedMeeting] =  await db.update(meetings)
        .set(input)
        .where(
          and(
            eq(meetings.id,input.id),
            eq(meetings.userId,ctx.auth.user.id)
          )
        ).returning();

        if(!updatedMeeting){
          throw new TRPCError({
            code:"NOT_FOUND",
            message:"Meeting not found"
          });
        }
        return updatedMeeting;
      }),

    create: protectedProcedure.input(meetingInsertSchema).mutation(async ({ input, ctx }) => {

        const [createMeeting] = await db.insert(meetings).values({
            ...input,

            userId: ctx.auth.user.id,
        })
            .returning();

        return createMeeting;
    }),
 
  
    getOne: protectedProcedure.input(
        z.object({ id: z.string() }))
        .query(async ({ input, ctx }) => {
            const [existingMeeting] = await db.select({
                ...getTableColumns(meetings),

            }).from(meetings).where(
                and(
                    eq(meetings.id, input.id),
                    eq(meetings.userId, ctx.auth.user.id),
                )
            );
            if (!existingMeeting) {
                throw new TRPCError({ code: "NOT_FOUND", message: "meeting not found" })
            }
            return existingMeeting;
        }),


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
                agentId:z.string().nullish(),
                status:z.enum(
                    [
                        MeetingStatus.Upcoming,
                        MeetingStatus.Active,
                        MeetingStatus.Compelted,
                        MeetingStatus.Processing,
                        MeetingStatus.Cancelled,
                    ] ).nullish(),
            })
        )
        .query(async ({ ctx, input }) => {
            const { page, pageSize, search,status,agentId } = input;

            const data = await db
                .select({
                    ...getTableColumns(meetings),
                    agent:agents,
                    duration:sql<number>`EXTRACT(EPOCH FROM (ended_at-started_at))`.as("duration")

                })
                .from(meetings)
                .innerJoin(agents,eq(meetings.agentId,agents.id))
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${search}%`) : undefined,
                        status? eq(meetings.status,status):undefined,
                        agentId? eq(meetings.agentId,agentId):undefined,

                    )
                )
                .orderBy(desc(meetings.createdAt), desc(meetings.id))
                .limit(pageSize)
                .offset((page - 1) * pageSize);

            const [total] = await db
                .select({ count: count() })
                .from(meetings)
                .where(
                    and(
                        eq(meetings.userId, ctx.auth.user.id),
                        search ? ilike(meetings.name, `%${search}%`) : undefined
                    )
                );

            return {
                items: data,
                total: total.count,
                totalPages: Math.ceil(total.count / pageSize),
            };
        }),

})