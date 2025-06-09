import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ButtonDialogProps {
  dialogForm: React.ElementType;
  label: string; // Accepts a React component as a prop
  css?: string;
  record_id?: any;
  dialog_title?: string;
}

export function ButtonDialog({ dialogForm: DialogForm, label, css,record_id, dialog_title }: ButtonDialogProps) {
  return (
    <Dialog modal={false}>
      <DialogTrigger asChild>
        <a className={css}>{label}</a>
      </DialogTrigger>
      <DialogContent 
        onInteractOutside={(event) => event.preventDefault()} 
        className="w-full sm:max-w-screen-lg sm:p-6 bg-white rounded-lg shadow-lg overflow-y-auto">
        <DialogHeader>
            <DialogTitle>
              <div className="flex flex-col">
                  <h1 className="text-2xl font-bold">{dialog_title}</h1>
              </div>
            </DialogTitle>
        </DialogHeader>
        <DialogForm record_id={record_id}/> 
      </DialogContent>
    </Dialog>
  );
}
