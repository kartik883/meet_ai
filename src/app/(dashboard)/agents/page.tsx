import { AgentsErrorState, AgentsLoadingState, AgentsViews } from "@/modules/agents/ui/views/agent-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { AgentListHeader } from "@/modules/agents/ui/components/agent-list-header";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { SearchParams } from "nuqs";
import { loadSearchParams } from "@/modules/agents/params";

interface Props {
  searchParam:Promise<SearchParams>;
}

const Page = async ({searchParam}:Props) => {
  const filters = await loadSearchParams(searchParam);
  const session = await  auth.api.getSession({
      headers:await headers(),
    });
    if(!session){
      redirect("/sign-in");
    }
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({
      ...filters,
    }))
    return ( 
      <>
      <AgentListHeader/>
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<AgentsLoadingState/>}>
            <ErrorBoundary fallback={<AgentsErrorState/>}>
              <AgentsViews />
            </ErrorBoundary>
             
             </Suspense>

        </HydrationBoundary>
        </>
   
)

    
}

export default Page;