import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { personProfileFormSchema } from "./page";

type FormValues = z.infer<typeof personProfileFormSchema>

type Props = {
  form: UseFormReturn<FormValues>;
};

export default function PersonProfileSectors({form} : Props){

}