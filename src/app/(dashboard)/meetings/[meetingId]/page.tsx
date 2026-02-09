import { auth } from "@/lib/auth";
import { MeetingIdErrorState, MeetingIdLoadingState, MeetingIdView } from "@/modules/meetings/ui/views/meeting-id-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props{
    params:Promise<{
        meetingId:string
    }>
}
const Page= async ({params}:Props)=>{
    const session = await  auth.api.getSession({
          headers:await headers(),
        });
        if(!session){
          redirect("/sign-in");
        }
    const {meetingId} = await params;
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(
        trpc.meetings.getOne.queryOptions({id:meetingId})
    )
    return (
        <HydrationBoundary>
            <Suspense fallback={<MeetingIdLoadingState/>}>
                <ErrorBoundary fallback={<MeetingIdErrorState/>}>
                   <MeetingIdView meetingId={meetingId}/>
                </ErrorBoundary>
            </Suspense>
        </HydrationBoundary>
    )
}
export default Page;