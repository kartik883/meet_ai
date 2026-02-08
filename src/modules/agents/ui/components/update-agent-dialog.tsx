import { ResponsiveDialog } from "@/components/responsive-dialog";
import { AgentForm } from "./agent-form";
import { AgentGetOne } from "../../types";

interface uptadeAgentDialogProps{
    open:boolean;
    onOpenChange:(open:boolean)=> void;
    initalValues:AgentGetOne;
}

export const UpdataAgentDialog=({
    open,
    onOpenChange,
    initalValues
}:uptadeAgentDialogProps)=>{
    return(
        <ResponsiveDialog
        title="Edit Agents"
        description="Edit the Agent details"
        open={open}
        onOpenChange={onOpenChange}
        >
            <AgentForm
            onSuccess={()=>onOpenChange(false)}
            onCancel={()=>onOpenChange(false)}
            initialValues={initalValues}
            />
        </ResponsiveDialog>
    )

}