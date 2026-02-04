"use client"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { Description } from "@radix-ui/react-dialog";

export const AgentsViews = () => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions());
  
    
    return (
        <div>
           hi agents
        </div>
    )
}