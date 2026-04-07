"use client";
import Link from "next/link";
import Image from "next/image";
import { CallControls, SpeakerLayout, useCall } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

interface Props {
    onLeave:()=> void;
    meetingName:string
};

export const CallActive =({onLeave,meetingName}:Props)=>
{
    const call = useCall();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex h-full items-center justify-center text-white">
                <div className="animate-pulse">Loading call...</div>
            </div>
        );
    }

    const handleLeaveClick = () => {
        if (call) {
            try {
                call.leave();
            } catch (error) {
                console.error("Error leaving call:", error);
            }
        }
        onLeave();
    };

    return(
        <div className="flex flex-col justify-between h-full w-full text-white bg-black">
            <div className="bg-gradient-to-b from-black/80 to-black/40 p-4 flex items-center gap-4 z-10">
                <Link href="/meetings" className="flex items-center justify-center p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors" >
                    <Image src="/logo.svg" width={24} height={24} alt="logo"/>
                </Link>
                <h4 className="text-lg font-semibold">
                    {meetingName}
                </h4>
            </div>
            
            <div className="flex-1 flex items-center justify-center w-full overflow-hidden bg-black">
                <div className="w-full h-full">
                    <SpeakerLayout />
                </div>
            </div>
            
            <div className="bg-gradient-to-t from-black/80 to-black/40 p-4 flex justify-center z-10">
                <CallControls onLeave={handleLeaveClick} />
            </div>
        </div>
    )
}