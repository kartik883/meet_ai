import { EmptyState } from "@/components/empty-state"
export const CancelState=()=>{
    return(
        <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center">
            <EmptyState
            title="Meeting Cancel"
            description="This meeting is cancelled"
            image="/cancelled.svg"
            />
        </div>
    )
}