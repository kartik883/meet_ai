"use client"
import { DefaultVideoPlaceholder, StreamVideoParticipant, ToggleAudioPreviewButton, ToggleVideoPreviewButton, useCallStateHooks, VideoPreview } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";

interface Props {
    userName: string;
    userImage: string;
}

const DisabledVideoPreview = ({ name, image }: { name: string; image: string }) => {
    return (
        <DefaultVideoPlaceholder
            participant={
                {
                    name: name,
                    image: image,
                } as StreamVideoParticipant
            }
        />
    )
}

const AllowBrowserPermissions = () => {
    return (
        <div className="w-full h-64 bg-slate-900 rounded-lg flex items-center justify-center">
            <p className="text-sm text-slate-400">
                Please grant browser permission to access camera and microphone
            </p>
        </div>
    )
}

export const VideoPreviewSection = ({ userName, userImage }: Props) => {
    const { useCameraState, useMicrophoneState } = useCallStateHooks();
    const { hasBrowserPermission: hasMicPermission } = useMicrophoneState();
    const { hasBrowserPermission: hasCameraPermission } = useCameraState();
    const [clientReady, setClientReady] = useState(false);

    useEffect(() => {
        setClientReady(true);
    }, []);


    const hasBrowserMediaPermission = hasCameraPermission && hasMicPermission;

    return (
            <div className="flex flex-col items-center gap-y-4 w-full min-h-64">
                {clientReady ? (
                    hasBrowserMediaPermission ? (
                        <>
                            <VideoPreview
                                DisabledVideoPreview={() => (
                                    <DisabledVideoPreview name={userName} image={userImage} />
                                )}
                            />
                            <div className="flex gap-x-3 justify-center">
                                <ToggleAudioPreviewButton />
                                <ToggleVideoPreviewButton />
                            </div>
                        </>
                    ) : (
                        <AllowBrowserPermissions />
                    )
                ) : (
                    <div className="w-full h-64 bg-slate-900 rounded-lg flex items-center justify-center">
                        <div className="animate-pulse text-slate-400">Loading camera...</div>
                    </div>
                )}
            </div>
    )
}
