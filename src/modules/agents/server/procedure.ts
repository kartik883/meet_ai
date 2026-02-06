import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { resolve } from "path";
import { agentInsertSchema } from "../schemas";
import { z } from "zod";
import { eq, getTableColumns, sql } from "drizzle-orm";
export const agentRouter=createTRPCRouter({
    getOne:protectedProcedure.input(z.object({id:z.string()})).query (async({input})=>{
        const [existingAgnet] = await db.select({
            ...getTableColumns(agents),
            meetingCount: sql<number>`5`
        }).from(agents).where(eq(agents.id, input.id));
        //await new Promise((resolve)=> setTimeout(resolve,5000));
        
        return existingAgnet;
    }),

    getMany:protectedProcedure.query (async()=>{
        const data = await db.select().from(agents);
        //await new Promise((resolve)=> setTimeout(resolve,5000));
        
        return data;
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