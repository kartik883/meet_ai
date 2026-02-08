import { auth } from "@/lib/auth";
import { MeetingsListHeader } from "@/modules/meetings/ui/comonents/meeting-list-header";
import { MeetingsErrorState, MeetingsLoadingState, MeetingsView } from "@/modules/meetings/ui/views/meetings-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { MeetingsClientBoundary } from "@/modules/meetings/ui/views/meetings-client-boundry";


const Page= async ()=>{
    const session = await  auth.api.getSession({
        headers:await headers(),
        });
        if(!session){
          redirect("/sign-in");
        }
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getMany.queryOptions({})
    );
    return (
        <>
        <MeetingsListHeader/>
        <HydrationBoundary state={dehydrate(queryClient)}>
        <MeetingsClientBoundary />
      </HydrationBoundary>

        </>
       
    )
}
export default Page;
