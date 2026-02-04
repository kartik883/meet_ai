"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";




const HomeView=()=>{
    const  router = useRouter();
  
  return (
    <div className="flex flex-col p-4 gap-y-4">
      home view
    </div>
  )
}
export default HomeView;

