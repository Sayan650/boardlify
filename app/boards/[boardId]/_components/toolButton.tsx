"use client";

import { LucideIcon } from "lucide-react";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";

interface ToolButtonprops {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
    disabled?: boolean;
    active?: boolean;
}

export const ToolButton = ({
    icon: Icon,
    label,
    onClick,
    disabled ,
    active,
}: ToolButtonprops) => {
    return(
        <Hint label={label} side="top" sideOffset={18}>
            <Button
                onClick={onClick}
                disabled={disabled}
                size="icon"
                variant={active? "boardActive" : "board"}
                // className="text-base font-normal px-2"
            >
                <Icon />
            </Button>
        </Hint>
    )
}