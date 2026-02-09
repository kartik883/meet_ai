"use client"

import { DataTable } from "@/components/data-table";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client"
import {  useSuspenseQuery } from "@tanstack/react-query";
import { columns } from "../comonents/columns";
import { EmptyState } from "@/components/empty-state";
import { useRouter } from "next/navigation";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
import { DataPagination } from "@/components/data-pagination";

export const MeetingsView=()=>{

    const trpc= useTRPC();
    const router = useRouter();
    const [filters,setFilters] = useMeetingsFilters();
    const {data} = useSuspenseQuery(trpc.meetings.getMany.queryOptions({
        ...filters
    }));

    return(
        <div>
            <DataTable data={data.items} columns={columns}
             onRowClick={(row)=>router.push(`/meetings/${row.id}`)}/>
            <DataPagination
            page={filters.page}
            totalPages={data.totalPages}
            onPageChange={(page)=>setFilters({page})}
            />

            {data.items.length===0&&(
            <EmptyState
            title="Create yur first meeting"
            description="Schedule meeting with agent"
             />
             )}

            
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