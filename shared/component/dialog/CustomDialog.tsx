import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useUiState, { DialogEnum } from "@/store/useUIStore";
import React from "react";
import { twMerge } from "tailwind-merge";

interface IProps {
  button?: React.ReactNode;
  width?: string;
  title: string;
  description: string;
  children: React.ReactNode;
  dialogName: DialogEnum; //add dialog name in the enum as you create
}

export default function CustomDialog({
  button,
  width = "max-w-md",
  title,
  description,
  children,
  dialogName,
}: IProps) {
  const { openDialogName, setOpenDialogName } = useUiState();
  return (
    <Dialog
      open={dialogName === openDialogName}
      onOpenChange={(open) => setOpenDialogName(open ? dialogName : null)}
    >
      {button && <DialogTrigger asChild>{button}</DialogTrigger>}
      <DialogContent className={twMerge("max-h-[90vh] overflow-y-auto", width)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
