"use client"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";

export const AgentsViews = () => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions());
  
  
    
    return (
        <div>
            {JSON.stringify(data,null,2)}
        </div>
    );
};

export const AgentsLoadingState = () => {
    return (
        <LoadingState
            title="Loading Agents"
            description="This may take a few second..."
        />
    );
}
export const AgentsErrorState = () => {
    return(
            <ErrorState 
            title="Failed to load agents"
            description="please try again later"/>
            
        );
}