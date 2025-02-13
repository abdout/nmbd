'use client';
import React, { useState, ReactElement } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Icon } from "@iconify/react";

interface DialogProps {
    triggerText: string;
    triggerIcon: string;
    children: ReactElement<{ onClose: () => void }>;
}

export function ShadcnDailog({ triggerText, triggerIcon, children }: DialogProps) {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-2 font-medium text-lg"
                >
                    <Icon icon={triggerIcon} width={30} />
                    {triggerText}
                </Button>
            </DialogTrigger>
            <DialogContent>
                {React.cloneElement(children, { onClose: handleClose })}
            </DialogContent>
        </Dialog>
    );
}
