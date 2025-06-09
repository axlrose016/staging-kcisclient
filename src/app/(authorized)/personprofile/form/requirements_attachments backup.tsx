import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
// import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import { useRef, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
// import { Button, buttonVariants } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption, } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Edit, Trash } from "lucide-react"

import { useState, useRef, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { FileIcon, ImageIcon, UploadIcon } from "lucide-react"
import { getFileToUploadLibraryOptions } from "@/components/_dal/options";

export default function RequirementsAttachment({ errors, capturedData, updateCapturedData, selectedModalityId }: { errors: any; capturedData: any; updateCapturedData: any, selectedModalityId: any }) {
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const [filesToUpload, setFilesToUpload] = useState<LibraryOption[]>([]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0]
        if (selectedFile) {
            const fileType = selectedFile.type
            if (fileType === "application/pdf" || fileType === "image/png" || fileType === "image/jpeg") {
                setFile(selectedFile)
                setError(null)
            } else {
                setFile(null)
                setError("Please select a PDF, PNG, or JPG file.")
            }
        }
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const files_upload = await getFileToUploadLibraryOptions();
                setFilesToUpload(files_upload);

                const formDataLS = localStorage.getItem("formData");

                // First, check if formDataLS exists
                if (formDataLS) {
                    const parsedData = JSON.parse(formDataLS);
                    setUploadedFiles(parsedData?.cfw[5].files || []);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]); // Store all uploaded files

    const handleFileUploadChang1 = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadedFiles((prevFiles) => {
                const updatedFiles = [...prevFiles, file];
                console.log("Updated files:", updatedFiles);  // Log the updated array
                return updatedFiles;
            });
            console.log("New file added:", file.name);


        }
    };

    // const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    //     if (e.target.files && e.target.files.length > 0) {
    //         const file = e.target.files[0];

    //         setUploadedFiles((prevFiles) => {
    //             const updatedFiles = [...prevFiles];
    //             updatedFiles[index] = file; // Replace or add the file at the specific index
    //             return updatedFiles;
    //         });

    //         console.log(`File uploaded for index ${index}:`, file.name);
    //     }
    // };

    const handleFileUploadChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, file_upload_id: number) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            // Read data from localStorage
            const formData = localStorage.getItem("formData");
            const prevData = formData ? JSON.parse(formData) : { cfw: [{}, {}, {}, {}, {}, { files: [] }] };

            const files = prevData.cfw[5]?.files || [];

            // Check if the file name exists in any of the array elements
            const fileNameExists = files.some((f: any) => f.file_name === file.name);

            if (fileNameExists) {
                alert(`The file "${file.name}" already exists. Please choose a different file.`);
                return; // Exit the function without updating state or localStorage
            }

            // Update state for immediate display (after validation)
            setUploadedFiles((prevFiles) => {
                const updatedFiles = [...prevFiles];
                updatedFiles[index] = file;
                return updatedFiles;
            });

            // Proceed to update localStorage if the file name is unique
            const updatedData = {
                ...prevData,
                cfw: prevData.cfw.map((cfwItem: any, i: number) => {
                    if (i !== 5) return cfwItem; // Only update index 5

                    const existingFiles = cfwItem.files || [];

                    // Check if the file_upload_id already exists
                    const fileExists = existingFiles.some((f: any) => f.file_upload_id === file_upload_id);

                    const updatedFiles = fileExists
                        ? existingFiles.map((f: any) =>
                            f.file_upload_id === file_upload_id
                                ? { ...f, name: file.name } // Update file name
                                : f
                        )
                        : [...existingFiles, { file_upload_id, name: file.name }]; // Append new file

                    return { ...cfwItem, files: updatedFiles };
                }),
            };

            // Save the updated data back to localStorage
            localStorage.setItem("formData", JSON.stringify(updatedData));
            console.log("Updated formData:", updatedData);
        }
    };






    return (
        <>
            <div  >

                {/* <div>
                    {filesToUpload.map((file, index) => (
                        <p key={index} className="text-gray-700">
                            {file.name ? file.id + ' ' + file.name : "Wlang label"}
                        </p>
                    ))}
                </div> */}

                <div className="grid sm:grid-cols-1 gap-4">
                    {filesToUpload.map((file, index) => (
                        <div key={index} className="flex items-center gap-4 border p-4 rounded-lg bg-gray-50">
                            {/* Upload Icon (small square) */}
                            <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-md border">
                                <label htmlFor={`file-upload-${index}`} className="cursor-pointer text-xs text-gray-500">
                                    📤
                                </label>
                                <input
                                    type="file"
                                    id={`file-upload-${index}`}
                                    className="hidden"
                                    onChange={(e) => handleFileUploadChange(e, index, file.id)}
                                />
                            </div>

                            {/* Label and uploaded file placeholder */}
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-700">{file.name}</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {/* {uploadedFiles[index] ? uploadedFiles[index].name : "No file uploaded"} */}
                                    {uploadedFiles[index] ? uploadedFiles[index].name : "No file uploaded"}

                                    {/* {(uploadedFiles[index] as Record<string, any>).file_name ?? "No file uploaded"} */}
                                    {/* {(uploadedFiles[index] as Record<string, any>).file_name ?? "No file uploaded"} */}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>










            </div >


        </>
    )
}