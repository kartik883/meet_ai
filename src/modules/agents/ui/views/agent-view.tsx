"use client"
import { useQuery, useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Button } from "@/components/ui/button";
import { DataTable } from "../components/data-table";
import { columns } from "../components/columns";
import { EmptyState } from "@/components/empty-state";


export const AgentsViews = () => {
    const trpc = useTRPC();
    const {data} = useSuspenseQuery(trpc.agents.getMany.queryOptions());
  
  
    
    return (
        <div className="flex-1 pb-4 px-4 md:px-8 flex flex-col gap-y-4">
            {data.length === 0 ? (
                <EmptyState
                    title="Create your first agent"
                    description="create for meeting and follow instrucion"
                />
            ) : (
                <DataTable data={data} columns={columns} />
            )}
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