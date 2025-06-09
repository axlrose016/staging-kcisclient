import { useState } from "react";

export function useDialog() {
  const [dialog, setDialog] = useState<{ open: boolean; content: React.ReactNode; title?: string }>({
    open: false,
    content: null,
    title: "Notification",
  });

  const showDialog = (content: React.ReactNode, title = "Notification") => {
    setDialog({ open: true, content, title });
  };

  const closeDialog = () => {
    setDialog({ open: false, content: null, title: "Notification" });
  };

  return { dialog, showDialog, closeDialog };
}
