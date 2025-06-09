import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DialogProps {
  open: boolean;
  title?: string;
  content: React.ReactNode; // Accepts any JSX component
  onClose: () => void;
}

export default function DialogComponent({ open, title = "Notification", content, onClose }: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div>{content}</div> {/* Render the passed component */}
        <DialogFooter>
          <Button onClick={onClose}>OK</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
