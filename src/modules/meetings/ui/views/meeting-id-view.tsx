"use client"

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdViewHeader } from "../comonents/meeting-id-view-header";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useConfirm } from "@/hooks/use-confirm";
import { title } from "process";
import { UpdateMeetingDialog } from "../comonents/update-meeting-dialog";
import { useState } from "react";
import { UpcomingState } from "../comonents/upcoming-state";
import { ActiveState } from "../comonents/active-state";
import { CancelState } from "../comonents/cancel-state";
import { ProcessingState } from "../comonents/processing-state";

interface Props{
    meetingId:string;
}

export const MeetingIdView=({meetingId}:Props)=>{
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    const router = useRouter();
    const [updateMeetingDialogOpen,setUpdateMeetingDialogOpen] = useState(false);
    const [RemoveConfirmation, confirmRemove] = useConfirm(
        "Are yu sure?",
        "the actin will remove meeting"
    )
    const {data} = useSuspenseQuery(
        trpc.meetings.getOne.queryOptions({id:meetingId}),
    );
    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess:()=>{
                queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
                router.push("/meetings");                            
            },
            // onError:(error)=>{
            //     toast.error(error.data.me)
            // }
        })
    );

    const handleRemoveMeeting = async()=>{
        const ok = await confirmRemove();
        if(!ok) return;
        await removeMeeting.mutateAsync({id:meetingId})
    }
    const isActive = data.status === "active";
    const isUpcoming = data.status === "upcoming";
    const isCancelled = data.status === "cancelled";
    const isCompleted = data.status === "compelted";
    const isProcessing = data.status === "processing";

    return(
        <>
        <RemoveConfirmation/>

        <UpdateMeetingDialog
        open={updateMeetingDialogOpen}
        onOpenChange={setUpdateMeetingDialogOpen}
        initialValues={data}
        />

    
        <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
         <MeetingIdViewHeader
        meetingId={meetingId}
        meetingName={data.name}
        onEdit={()=> setUpdateMeetingDialogOpen(true)}
        onRemove={handleRemoveMeeting}
        />

        {isCancelled && <CancelState/>}
        {isProcessing && <ProcessingState/>}
        {isCompleted && <div>Compelted</div>}
        {isUpcoming && (<UpcomingState
        meetingId={meetingId}
        onCancekMeeting={()=>{}}
        isCancelling={false}
        />)}
        {isActive &&
        (<ActiveState meetingId={meetingId}/>)}
        

        </div>
        </>
    )

}

export const MeetingIdLoadingState = () => {
    return (
        <LoadingState
            title="Loading Meeting"
            description="This may take a few second..."
        />
    );
}
export const MeetingIdErrorState = () => {
    return(
            <ErrorState 
            title="Failed to load Meeting"
            description="please try again later"/>
            
        );
}
