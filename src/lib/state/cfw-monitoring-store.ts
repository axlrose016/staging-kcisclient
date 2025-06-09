import { IReportColumn } from "@/components/interfaces/reportdesigner";
import { create } from "zustand";

interface IDialog {
  open: false;
  record?: any;
  action?: string;
}
interface IState {
  columns: IReportColumn[];
  dialog: IDialog;
  onChangeColumns: (by: any[]) => void;
  onChangeDialog: (value: any) => void;
}

const useReportDesigner = create<IState>()((set) => ({
  columns: [],
  dialog: {
    open: false,
  },
  onChangeColumns: (by) => set({ columns: by }),
  onChangeDialog: (value) => set({ dialog: value }),
}));

export default useReportDesigner;
