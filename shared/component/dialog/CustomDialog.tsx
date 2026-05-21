import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import { twMerge } from "tailwind-merge";

interface IProps<TDialog extends string> {
  button?: React.ReactNode;
  width?: string;
  title: string;
  description: string;
  children: React.ReactNode;
  dialogName: TDialog;
  openDialogName: TDialog | null;
  onOpenDialogChange: (dialogName: TDialog | null) => void;
}

export default function CustomDialog<TDialog extends string>({
  button,
  width = "max-w-md",
  title,
  description,
  children,
  dialogName,
  openDialogName,
  onOpenDialogChange,
}: IProps<TDialog>) {
  return (
    <Dialog
      open={dialogName === openDialogName}
      onOpenChange={(open) => onOpenDialogChange(open ? dialogName : null)}
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
