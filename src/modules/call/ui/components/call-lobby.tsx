"use client"
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { generatedAvatarUri } from "@/lib/avatar";
import { LogInIcon } from "lucide-react";
import Link from "next/link";
import { VideoPreviewSection } from "./video-preview-section";
interface Props {
    onJoin: () => void;
}

export const CallLobby = ({ onJoin }: Props) => {
    const { data } = authClient.useSession();

    const userName = data?.user.name ?? "Guest";
    const userImage = data?.user.image ?? generatedAvatarUri({
        seed: data?.user.name ?? "user",
        variant: "initials",
    });

    return (
        <div className="flex flex-col items-center justify-center h-full bg-radial from-sidebar-accent to-sidebar">
            <div className="py-4 px-8 flex flex-1 items-center justify-center">
                <div className="flex flex-col items-center justify-center gap-y-6 bg-background rounded-lg p-10 shadow-sm w-full max-w-md">
                    <div className="flex flex-col gap-y-2 text-center">
                        <h6 className="text-lg font-medium">Ready to join?</h6>
                        <p className="text-sm text-muted-foreground">Set up your call before join</p>
                    </div>
                    
                    <div className="w-full">
                        <VideoPreviewSection 
                            userName={userName} 
                            userImage={userImage}
                        />
                    </div>

                    <div className="flex gap-x-2 justify-between w-full">
                        <Button asChild variant="ghost">
                            <Link href="/meetings">
                                Cancel
                            </Link>
                        </Button>
                        <Button
                            onClick={onJoin}
                        >
                            <LogInIcon className="w-4 h-4" />
                            Join Call
                        </Button>
                    </div>

                </div>
            </div>
        </div>
    )
}

