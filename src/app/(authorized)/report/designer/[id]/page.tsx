"use client";

import { Button } from '@/components/ui/button';
import React, { forwardRef, useEffect, useMemo, useState } from 'react'
import {
  SimpleTreeItemWrapper,
  SortableTree,
  SortableTreeProps,
  TreeItemComponentProps,
  TreeItems,
} from "dnd-kit-sortable-tree";
import { Edit2Icon, Trash2Icon } from 'lucide-react';
import styles from "@/components/dndkit/TreeItem.module.css";
import useReportDesigner from '@/lib/state/cfw-monitoring-store';
import clsx from 'clsx';
import { processExcelFile, removeItemAtIndex, replaceItemAtIndex } from '@/lib/utils';
import { FileUploader } from './FileUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { debounce } from 'lodash';
import { AppTable } from '@/components/app-table';
import { toast } from '@/hooks/use-toast';
import { SessionPayload } from '@/types/globals';
import { getSession } from '@/lib/sessions-client';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { replaceMetas } from '../../cfw/page';
import Image from 'next/image';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type TreeItemData = {
  id?: string;
  children?: TreeItemData[];
};
/*
 * Here's the component that will render a single row of your tree
 */
export const TreeItem = forwardRef<
  HTMLDivElement,
  TreeItemComponentProps<TreeItemData> | any
>((props, ref) => {

  const { onChangeDialog } = useReportDesigner();
  const { childCount, clone, onRemove, item, isOver, isOverParent } = props;

  const enableCustomStyleWhenOver =
    document.location.href.includes("vs-code-like");
  return (
    <SimpleTreeItemWrapper
      {...props}
      //ts-ignored
      contentClassName={clsx(
        enableCustomStyleWhenOver && isOver && styles.over,
        enableCustomStyleWhenOver && isOverParent && styles.overParent
      )}
      ref={ref}
    >
      <div className="flex flex-1 gap-1">
        <span
          className={styles.Text}
        >
          {item?.label || "Missing Metadata"}
        </span>
      </div>
      {!clone && onRemove && (
        <div className='flex items-center gap-2'>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onChangeDialog({
                record: item,
                open: true,
                action: "edit"
              })
              // onRemove();
              // const r = {
              //   ...dialog,
              //   title: "Update Indicator",
              //   form: meta,
              //   action: "update",
              //   isOpen: true,
              // };
              // console.log("item", r);
              // setDialogOpen(r);
            }}
          >
            <Edit2Icon size={18} />
          </Button>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onChangeDialog({
                record: item,
                open: true,
                action: "delete"
              })
              // setDialogOpen({
              //   // ...dialog,
              //   // form: meta,
              //   title: "Delete " + meta?.name + "?",
              //   action: "delete",
              //   isOpen: true,
              // });
            }}
          >
            <Trash2Icon size={18} />
          </Button>
        </div>
      )}
      {clone && childCount && childCount > 1 ? (
        <span className={styles.Count}>{childCount}</span>
      ) : null}
    </SimpleTreeItemWrapper>
  );
});
TreeItem.displayName = "TreeItem";

export default function MonitoringCFW() {

  const { columns, onChangeColumns, dialog, onChangeDialog } = useReportDesigner();

  const params = useParams<{ id: string }>()
  const [excelData, setExcelData] = useState<any[] | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const items = columns as TreeItems<TreeItemData>

  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [activeId, setActiveId] = useState("new")
  const [report, setReport] = useState({
    name: "",
    columns
  })

  const [session, setSession] = useState<SessionPayload>();

  useEffect(() => {
    console.log('params', params)
    const id = params?.id == "new" ? "new" : params!.id;
    setActiveId(id);

    (async () => {
      if (id !== "new") {
        setExcelData([])
        const raw = await dexieDb.report_designer.where("id").equals(id).first()
        const gc = await dexieDb.report_column.where("report_designer_id").equals(id).toArray()
        const cols = replaceMetas(JSON.parse(raw!.columns), gc)
        onChangeColumns(replaceMetas(cols, gc))
        setReport({
          name: raw!.name, columns: cols
        })
        console.log("raw", { raw, cols })
      }
      console.log('id', id)
    })();
  }, [params])

  useEffect(() => {
    (async () => {
      const _session = await getSession() as SessionPayload;
      setSession(_session);
      try {
        if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    })();
    onChangeDialog({
      open: false
    })
  }, [])


  const handleFileUpload = async (file: File) => {
    setIsProcessing(true);
    try {
      const data = await processExcelFile(file);

      onChangeColumns(
        data.map((i, idx) => ({
          id: uuidv4(),
          report_designer_id: activeId,
          label: i,
          value: "",
          type: "number",
          description: "",
          options: JSON.stringify({}),
        }))
      )


      console.log('handleFileUpload', { data })
      setExcelData(data);
    } catch (error) {
      console.error("Error processing file:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = () => {
    const report_clean_column = cleanUpIds(columns)
    const saveId = params?.id == "new" ? uuidv4() : activeId
    const raw = {
      id: saveId,
      name: report.name,
      columns: JSON.stringify(report_clean_column),
      push_status_id: params?.id == "new" ? 0 : 0,
      push_date: params?.id == "new" ? "" : "",
      created_date: new Date().toISOString(),
      created_by: session?.userData.email ?? "",
      deleted_date: null,
      deleted_by: null,
      last_modified_by: params?.id == "new" ? null : session?.userData.email,
      last_modified_date: params?.id == "new" ? null : new Date().toISOString(),
      is_deleted: false,
    }

    const fcols = flattenArray(columns).map(i => ({ ...i, report_designer_id: saveId }))
    console.log('handleSave', { raw, fcols })

    if (raw.name.trim() == "" || columns.length == 0) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Please provide Report Name!",
        duration: 3000
      });
    } else {
      (async () => {
        await dexieDb.report_designer.put({ ...raw }, 'id')
        await dexieDb.report_column.bulkPut(fcols)
        toast({
          variant: "green",
          title: "Success!",
          description: "Report has successfuly saved!",
          duration: 3000
        });
      })();
    }
  }

  const handleDelete = () => {
    console.log('handleDelete', dialog)
    onChangeColumns(columns.filter(i => i.id !== dialog.record.id))
    onChangeDialog({
      open: false
    })
  }


  const handleSaveColumnConfig = (e?: string, key?: string) => {
    if (key) {
      const raw = {
        ...dialog.record,
        [key]: e
      }
      onChangeDialog({
        ...dialog,
        record: raw,
      })

      console.log('handleSave', { columns, e, key, raw })
    } else {
      const idx = columns.findIndex(i => i.id == dialog.record.id)
      const newcols = replaceItemAtIndex(columns, idx, dialog.record)
      onChangeColumns(newcols)

      onChangeDialog({
        open: false
      })
      console.log('handleSave', { columns, newcols })
    }
  }

  return (
    <>

      <Card>
        <CardHeader>
          <CardTitle className="mb-2 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
            <div className="flex-shrink-0">
              <Image src="/images/logos.png" width={300} height={300} alt="DSWD KC BAGONG PILIPINAS" className="h-12 w-auto" />
            </div>
            <span className='font-bold'>{activeId == "new" ? "Create" : "Update"} Template</span>
          </CardTitle>

        </CardHeader>
        <CardContent>

          <div className="min-h-screen">

            {activeId == "" ? <span>Loading...</span> : <>
              {!excelData ?
                <>  <FileUploader onFileUpload={handleFileUpload} isProcessing={isProcessing} /> </> : <>
                  <div className='flex mx-2 items-center justify-between gap-2'>
                    <Input defaultValue={report.name} className='text-lg my-1' placeholder='Template Name' onChange={debounce((e) => setReport({
                      ...report,
                      name: e.target.value
                    }), 500)} />
                    <div className='flex items-center gap-2'>
                      <Button>
                        Add Label
                      </Button>
                      <Button onClick={handleSave}>
                        Save
                      </Button>
                    </div>
                  </div>
                  <div className="dndsortable px-2 max-h-[56rem] overflow-scroll rounded-xl ">
                    <SortableTree
                      items={items}
                      onItemsChanged={onChangeColumns}
                      TreeItemComponent={TreeItem}
                    />
                  </div>
                </>}
            </>}

          </div>

        </CardContent>
      </Card>


      <Drawer direction={isDesktop ? "right" : "bottom"} open={dialog.open && dialog.action == "edit"} onOpenChange={(e) => onChangeDialog({
        ...dialog,
        open: e
      })}>

        <DrawerContent className="left-auto  right-4 top-2 bottom-2 fixed z-50  outline-none max-w-[510px] flex border-none mt-0 ">
          <DrawerHeader className="text-left">
            <DrawerTitle className='font-bold my-2'>Configure Column</DrawerTitle>
          </DrawerHeader>

          <div className='flex flex-col  p-4 w-full'>
            <div className="grid w-full items-center gap-1.5 mb-4">
              <Label htmlFor="name">Label</Label>
              <Input
                onChange={debounce((e) => handleSaveColumnConfig(e.target.value, "label"), 500)}
                id="name" className="w-full" placeholder="..." defaultValue={dialog.record?.label} />
            </div>

            <div className="grid w-full items-center gap-1.5 mb-4">
              <Label htmlFor="type">Type</Label>
              <Select onValueChange={(e) => handleSaveColumnConfig(e, "type")} defaultValue={dialog.record?.type || "Text"}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Text</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="calculated">Calculated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid w-full items-center gap-1.5 mb-4">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                className="w-full"
                placeholder="Enter description..."
                defaultValue={dialog.record?.description}
                onChange={debounce((e) => handleSaveColumnConfig(e.target.value, "description"), 500)}
              />
            </div>

            <span>{JSON.stringify(dialog.record)}</span>
          </div>

          <DrawerFooter className="pt-2">
            <div className="mt-6 px-2">
              <Button onClick={() => handleSaveColumnConfig()} className="w-full"  >
                Save
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>


      <Dialog open={dialog.open && dialog.action == "delete"} onOpenChange={(e) => onChangeDialog({
        ...dialog,
        open: e
      })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription> Are you sure you want to delete this record? This action cannot be undone."
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => onChangeDialog({
              open: false
            })}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>

  );
}


export type Node = {
  id: string;
  children?: Node[];
  [key: string]: any;
};

export function flattenArray(arr: any[]) {
  const result: any[] = [];
  const excludedKeys = new Set([
    "children",
    "isLast",
    "depth",
    "index",
    "parentId",
    "parent"
  ]);

  function recurse(items: any[]) {
    for (const item of items) {
      const cleanItem: any = {};
      for (const key in item) {
        if (!excludedKeys.has(key)) {
          cleanItem[key] = item[key];
        }
      }
      result.push(cleanItem);
      if (item.children) {
        recurse(item.children);
      }
    }
  }

  recurse(arr);
  return result;
}

function cleanUpIds(data: Node[]): { id: string; children?: any[] }[] {
  return data.map(({ id, children }) => ({
    id,
    ...(children ? { children: cleanUpIds(children) } : {})
  }));
}