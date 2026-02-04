import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { AgentsViews } from "@/modules/agents/ui/views/agent-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

const Page = async () => {
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentsLoadingState />}>
            <ErrorBoundary fallback={<AgentsErrorState/>}>

            
                <AgentsViews />
                </ErrorBoundary>
            </Suspense>

        </HydrationBoundary>

    )
}
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
export default Page;