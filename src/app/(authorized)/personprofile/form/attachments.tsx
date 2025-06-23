/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

const _session = (await getSession()) as SessionPayload;

import { v4 as uuidv4 } from "uuid";
import { LibraryOption } from "@/components/interfaces/library-interface";
// import { Input } from "@/components/ui/input";
// import { useRef, useState } from "react";
// import { Button, buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Check, EyeIcon, Upload } from "lucide-react";

import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getOfflineLibFilesToUpload } from "@/components/_dal/offline-options";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";

import { IAttachments } from "@/components/interfaces/general/attachments";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
import { IPersonProfile } from "@/components/interfaces/personprofile";
export default function Attachments({
  updateFormData,
  session,
  user_id_viewing,
  profileData,
}: {
  errors: any;
  capturedData: Partial<IAttachments>[];
  updateFormData: (newData: Partial<IAttachments>[]) => void;
  session: any;
  user_id_viewing: string;
  profileData: Partial<IPersonProfile>;
}) {
  const [userIdViewing, setUserIdViewing] = useState(user_id_viewing);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [filesToUploadOptions, setfilesToUploadOptions] = useState<
    LibraryOption[]
  >([]);
  const [selectedFileId, setSelectedFileId] = useState();
  const [selectedFile, setSelectedFile] = useState();

  const [attachmentsDexie, setAttachmentsDexie] = useState({});
  const [attachments, setAttachments] = useState<IAttachments[]>([]);
  const [attachmentNames, setAttachmentNames] = useState<
    Record<number, string>
  >({});
  const [isOpenForViewingFile, setIsOpenForViewingFile] = useState(false);
  const [selectedNameOfFile, setSelectedNameOfFile] = useState("");
  const [listOfAttachmentsData, setListOfAttachmentsData] = useState<any[]>([]);
  const [selectFilePathUrl, setSelectedFilePathUrl] = useState("");
  const [onlineAttachments, setOnlineAttachments] = useState<any[]>([]);
  let iflag = false;
  useEffect(() => {
    fetchAttachments();
  }, []);
  const fetchAttachments = async () => {
    // debugger;
    if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open

    try {
      const allAttachments = await dexieDb.attachments.toArray();

      // Exclude file_ids 3, 6, and 8
      const filteredRecords = allAttachments.filter(
        (record) => ![3, 4, 5, 6, 9, 12].includes(Number(record.file_id))
      );
      // setAttachments(allAttachments); // No error now

      // setAttachments(allAttachments); // No error now

      const files_to_upload = await getOfflineLibFilesToUpload();
      const attachment_map = Object.fromEntries(
        files_to_upload.map((ext: { id: number; name: string }) => [
          ext.id,
          ext.name,
        ])
      );
      setAttachmentNames(attachment_map);
      updateFormData(allAttachments);
      setAttachments(allAttachments);
      setListOfAttachmentsData(files_to_upload);
      // debugger;
      if (!iflag) {
        console.log("✅ Attachments fetched:", filteredRecords);
        iflag = true;
        return; // Break the iteration
      }
    } catch (error) {
      console.error("❌ Error fetching attachments:", error);
    }
  };

  useEffect(() => {
    console.log("Attachments updated:", attachments);
  }, [attachments]);

  const handleUploadFile = async (
    e: ChangeEvent<HTMLInputElement>,
    id: number
  ) => {

    debugger
    const file = e.target.files?.[0]; // Get the first selected file
    // alert(id)
    if (!file) return; // Exit if no file is selected
    if (!id || typeof id !== "number") {
      console.warn("⚠️ Invalid file_id:", id);
      return;
    }
    try {
      if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open

      // Create a Blob for the file
      const fileBlob = new Blob([file], { type: file.type });

      // Check if a record with the same file_id exists
      const existingRecord = await dexieDb.attachments
        .where("file_id") // Search by indexed field
        .equals(id)
        .and((record) => record.user_id === _session.id)
        .first();
      // alert("Existing type is " + existingRecord);
      if (existingRecord) {
        // ✅ Modify existing record
        await dexieDb.attachments.update(existingRecord.id, {
          file_name: file.name,
          file_type: file.type,
          file_path: fileBlob,
          record_id: profileData.id,
          remarks: ".",
          user_id: _session.id,
          // file_path: fileBlob,
          last_modified_date: new Date().toISOString(),
        });
        console.log(`✅ Updated record for file_id: ${id}`);
      } else {
        // ✅ Add a new record if none exists

        await dexieDb.attachments.add({
          id: uuidv4(), // Generate unique ID
          record_id: profileData.id ?? "",
          module_path: "personprofile",
          file_id: Number(id),
          file_name: file.name,
          file_type: file.type,
          file_path: fileBlob,
          created_date: new Date().toISOString(),
          last_modified_date: null,
          user_id: session.id ?? "",
          created_by: _session.userData.email ?? "", //for changing
          last_modified_by: null,
          push_status_id: 0,
          push_date: null,
          deleted_date: null,
          deleted_by: null,
          is_deleted: false,
          remarks: ".",
        });
        console.log(`✅ Added new record for file_id: ${id}`);
      }

      e.target.value = "";
      fetchAttachments(); // Refresh the attachments list
    } catch (error) {
      console.error("⚠️ Error handling file upload:", error);
    }
  };

  // useEffect(() => {
  //     const fetchData = async () => {
  //         try {
  //             // const files_upload = await getOfflineLibFilesToUpload(); //await getFileToUploadLibraryOptions();
  //             // setfilesToUploadOptions(files_upload);

  //             if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open

  //         } catch (error) {
  //             console.error('Error fetching data:', error);
  //         }
  //     };

  //     fetchData();
  // }, []);
  type UploadedFile = {
    id: number; // or number
    file_to_upload: string;
    file_name: string;
    file_size: number;
    file: File;
    file_path: string;
  };

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const [fileToUpload, setFileToUpload] = useState("");
  const [fileToUploadId, setFileToUploadId] = useState(0);

  const [fileInfo, setFileInfo] = useState({
    name: "",
    size: "",
    file_path: "",
  });

  // const handleDeleteFileRecord = (index: number) => {
  //     toast({
  //         variant: "destructive",
  //         title: "Are you sure?",
  //         description: "This action cannot be undone.",
  //         action: (
  //             <button
  //                 onClick={() => confirmDelete(index)}
  //                 className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
  //             >
  //                 Confirm
  //             </button>
  //         ),
  //     });
  // };

  // readonly when admin viewing
  useEffect(() => {
    debugger;
    if (userIdViewing) {
      const form = document.getElementById("attachments");
      if (form) {
        form
          .querySelectorAll("input, select, textarea, button, label")
          .forEach((el) => {
            el.setAttribute("disabled", "true");
          });
      }

      const lsAtt = localStorage.getItem("attachments");
      if (lsAtt) {
        const parseAtt = JSON.parse(lsAtt);
        setOnlineAttachments(parseAtt);
        // console.log("Parse att", parseAtt)
        // console.log("File ID", file_id)
        // const foundAttachment = parseAtt.filter((att: any) => att.file_id === file_id);
        // console.log("Nakita ", foundAttachment.length)
        // if (foundAttachment.length > 0) {
        //     const router = useRouter()
        //     router.push("https://kcnfms.dswd.gov.ph/media/blobs/" + foundAttachment.file_name)
        // }
      }
    }
  }, [userIdViewing]);

  function handleViewAttachment(file_name: string): void {
    window.open(
      "https://kcnfms.dswd.gov.ph/media/blobs/" + file_name,
      "_blank"
    );
    // router.push("https://kcnfms.dswd.gov.ph/media/blobs/" + file_name)

    // const lsAtt = localStorage.getItem("attachments");
    // if (lsAtt) {
    //     const parseAtt = JSON.parse(lsAtt);
    //     console.log("Parse att", parseAtt)
    //     console.log("File ID", file_id)
    //     const foundAttachment = parseAtt.filter((att: any) => att.file_id === file_id);
    //     console.log("Nakita ", foundAttachment.length)
    //     if (foundAttachment.length > 0) {
    //     }

    // }

    // alert(file_name);
    // const router = useRouter()
    // setIsOpenForViewingFile(true);
    // setSelectedFilePathUrl("https://kcnfms.dswd.gov.ph/media/blobs/" + file_name)
    //router.push("https://kcnfms.dswd.gov.ph/media/blobs/" + file_name)
    // setSelectedFilePathUrl(URL.createObjectURL("https://kcnfms.dswd.gov.ph/media/blobs/" + file_name))

    // setSelectedNameOfFile(file_name);
    // debugger;
    // if (file_id) {
    //     // debugger;
    //     const foundAttachment = listOfAttachmentsData.find((attachment) => attachment.id === file_id);
    //     if (foundAttachment) {
    //         setSelectedNameOfFile(foundAttachment.name);
    //         setSelectedFilePathUrl("https://kcnfms.dswd.gov.ph/media/blobs/" + foundAttachment.name)
    //         // setSelectedFilePathUrl("public/images/cover_page.png")
    //         return;
    //         if (file_name) {
    //             // setSelectedFilePathUrl(file_path)
    //         } else {
    //         }
    //     }
    // } else {

    // }
  }

  return (
    <div id="attachments_info_form">
      {/* <pre><h1>Attachments</h1>{JSON.stringify(capturedData, null, 2)}</pre> */}

      <div className="p-2 sm:col-span-4">
        <div className="p-2 col-span-4">
          <div className="flex items-center space-x-2 p-5 bg-white shadow-md rounded-md mb-5">
            {/* <Info className="w-5 h-5 text-blue-500" /> */}
            <p className="text-xl text-black-500 flex items-center">
              Click the upload icon to upload or change a file.
            </p>
          </div>
        </div>

        {/* <div>
                    {listOfAttachmentsData.map((loa, index) => (
                        <div key={index}>
                            <pre>{JSON.stringify(loa, null, 2)}</pre>
                        </div>
                    ))}
                </div> */}

        <div className="p-2 col-span-4">
          {/* {userIdViewing ? (
                        <p>Viewing</p>
                    ) : 'Not viewing'} */}
          <Table className={`min-w-[1000px] border }`}>
            {/* <Table className={`min-w-[1000px] border ${userIdViewing ? "opacity-50 pointer-events-none" : ""}`}> */}
            {/* <Table className="border"> */}

            <TableHeader>
              <TableRow key={0}>
                <TableHead className="w-[10px]">
                  <Check className="w-5 h-5 text-green-500" />
                </TableHead>
                <TableHead>File to Upload</TableHead>
                {/* <TableHead>File Name</TableHead>
                                <TableHead>File Size</TableHead> */}
                {/* <TableHead className="text-center">Action</TableHead> */}
                {/* <TableHead className={`${userIdViewing ? "hidden text-center" : ""}`}>Action</TableHead> */}
                <TableHead
                  className={`${userIdViewing ? "" : "hidden"} text-center`}
                >
                  View Attachment
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(() => {
                const source = userIdViewing
                  ? onlineAttachments.filter((f) => f.file_id !== 13)
                  : attachments.filter(
                      (f) => ![5, 6, 12, 13].includes(f.file_id ?? 0)
                    );

                const dedupedMap = new Map<string, (typeof source)[number]>();

                
                for (const item of source) {
                  if (Number(item.file_id) === 13) continue;
                  const key = String(item.file_id ?? item.id ?? Math.random()); // fallback key to avoid duplicate "0"
                  if (!dedupedMap.has(key)) {
                    dedupedMap.set(key, item);
                  }
                }

                const dedupedList = Array.from(dedupedMap.values());

                return dedupedList.length > 0 ? (
                  dedupedList.map((f, index) => {
                    const inputId = `file-upload-${f.id ?? index}`;

                    return (
                      <TableRow
                        key={f.id ?? index}
                        className={
                          !userIdViewing
                            ? "cursor-pointer hover:bg-gray-100"
                            : ""
                        }
                        onClick={() => {
                          if (!userIdViewing) {
                            document.getElementById(inputId)?.click();
                          }
                        }}
                      >
                        <TableCell className="w-[10px]">
                          {f.file_type !== "" ? (
                            <Check className="w-5 h-5 text-green-500" />
                          ) : (
                            ""
                          )}
                        </TableCell>

                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {attachmentNames[f.file_id ?? 0]}
                          </div>
                        </TableCell>

                        <TableCell className="text-center">
                          {userIdViewing ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleViewAttachment(f.file_name);
                                    }}
                                  >
                                    <EyeIcon className="cursor-pointer text-2xl" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>View Attachment</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 text-blue-500" />
                              <input
                                id={inputId}
                                type="file"
                                className="hidden"
                                onChange={(e) =>
                                  handleUploadFile(e, Number(f.file_id))
                                }
                                accept=".jpg,.png,.pdf"
                              />
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow key={0}>
                    <TableCell
                      colSpan={4}
                      className="text-center text-gray-500"
                    >
                      No Attachments.
                    </TableCell>
                  </TableRow>
                );
              })()}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog
        open={isOpenForViewingFile}
        onOpenChange={setIsOpenForViewingFile}
      >
        <DialogContent className=" max-w-full md:max-h-full">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription className="flex flex-col justify-center items-center pt-5">
              {/* <Image
                                src={selectFilePathUrl}
                                width={1000}
                                height={800}
                                alt="File preview placeholder"
                                className="rounded-md shadow-md   object-contain"
                            /> */}
              <span className="mt-5 text-2xl">{selectedNameOfFile}</span>
            </DialogDescription>
          </DialogHeader>

          {/* <DialogFooter>
                        <Button type="submit">Save changes</Button>
                    </DialogFooter> */}
        </DialogContent>
      </Dialog>
    </div>
  );
}
