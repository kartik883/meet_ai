"use client"
import { StreamTheme, useCall } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
interface Props{
    meetingName:string;
};

const LoadingScreen = () => (
    <div className="flex h-full items-center justify-center text-white">
        <div className="animate-pulse">Loading...</div>
    </div>
);

export const CallUI = ({meetingName}:Props)=>{
    const call = useCall();
    const [show, setShow] = useState<"lobby"|"call"|"ended">("lobby");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleJoin = async()=>{
        if(!call) {
            console.error("Call not available");
            return;
        }
        try {
            await call.join({ create: false });
            setShow("call");
        } catch (error) {
            console.error("Failed to join call:", error);
        }
    };

    const handleLeave=()=>{
        setShow("ended");
    }

    if (!mounted) {
        return <LoadingScreen />;
    }

    return(
        <StreamTheme className="h-full w-full bg-black">
            {show==="lobby"&& <CallLobby onJoin={handleJoin}/>}
            {show==="call"&& <CallActive onLeave={handleLeave} meetingName={meetingName}/>}
            {show==="ended"&&<p>ended meeting</p>}
        </StreamTheme>
    )

}