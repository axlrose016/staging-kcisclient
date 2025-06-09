import { redirect } from "next/navigation";
import { Button } from "../ui/button";

interface ButtonDialogProps {
  label: string; 
  css?: string;
  record_id?: any;
  path?: string;
}

export function ButtonView({ label, css, record_id, path }: ButtonDialogProps) {
  const handleOnClick = () => {
    if (path) {
      redirect(path); 
    }
  };

  return (
    <>
      <Button variant="secondary" onClick={handleOnClick} className={`m-1 ${css || ''}`}>
        {label} {}
      </Button>
    </>
  );
}
