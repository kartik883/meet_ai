"use client"

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"
import {  useSuspenseQuery } from "@tanstack/react-query";

export const MeetingsView=()=>{
    const trpc= useTRPC();
    const {data} = useSuspenseQuery(trpc.meetings.getMany.queryOptions({}));

    return(
        <div>
            {JSON.stringify(data)}
        </div>
    )
}

export const MeetingsLoadingState = () => {
    return (
        <LoadingState
            title="Loading Meetings"
            description="This may take a few second..."
        />
    );
}
export const MeetingsErrorState = () => {
    return(
            <ErrorState 
            title="Failed to load meetings"
            description="please try again later"/>
            
        );
}