"use client"

import { getModuleLibraryOptions, getPermissionLibraryOptions } from "@/components/_dal/options";
import { fetchUserAccess, fetchUsers } from "@/components/_dal/users";
import { ButtonDelete } from "@/components/actions/button-delete";
import { ButtonDialog } from "@/components/actions/button-dialog";
import { ButtonEdit } from "@/components/actions/button-edit";
import UserForm from "@/components/dialogs/settings/user/frmuser";
import { FormDropDown } from "@/components/forms/form-dropdown";
import LoadingScreen from "@/components/general/loading-screen";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useraccess } from "@/db/schema/users";
import React, { useEffect, useState } from "react"

export default function UserAccess({ record_id }: { record_id?: string }) {
    const [userAccess, setUserAccess] = useState([]);
    const [moduleOptions, setModuleOptions] = useState<LibraryOption[]>([]);
    const [selectedModule, setSelectedModule] = useState("");
    const [permissionOptions, setPermissionOptions] = useState<LibraryOption[]>([]);
    const [selectedPermission, setSelectedPermission] = useState("");

    const [loading, setLoading] =useState(true);


    //Handle On Change
    const handleModuleChange = (id: any) => {
        setSelectedModule(id);
    }
    useEffect(() => {
        async function loadUserAccess(){
            try{
                const [userAccess, modules, permissions] = await Promise.all([
                    fetchUserAccess(record_id, "user_id"),
                    getModuleLibraryOptions(),
                    getPermissionLibraryOptions()
                ]);
                setUserAccess(userAccess);
                setModuleOptions(modules);
                setPermissionOptions(permissions);
            }catch(error){
                console.error(error);
            }finally{
                setLoading(false);
            }
        }
        loadUserAccess();
    }, []);


    if(loading){
        return <div>
            <LoadingScreen
                    isLoading={loading}
                    text={"Loading... Please wait."}
                    style={"dots"}
                    fullScreen={true}
                    progress={0}
                    timeout={0}
                    onTimeout={() => console.log("Loading timed out")}
                  />
        </div>
    }
    return(
        <Table className="table-fixed w-full text-left">
            <TableCaption>A list of all User Access.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-1/8">Module</TableHead>
                    <TableHead className="w-1/8">Permission</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {userAccess.map((access:any) =>(
                    <TableRow key={access.id}>
                         <TableCell className="font-medium">
                            <FormDropDown
                                options={moduleOptions}
                                selectedOption={access.module_id}
                                onChange={handleModuleChange}
                                />
                        </TableCell>
                        <TableCell className="font-medium">
                            <FormDropDown
                                options={permissionOptions}
                                selectedOption={access.permission_id}
                                onChange={handleModuleChange}
                                />
                        </TableCell>
                        <TableCell className="text-right">
                            <ButtonDialog dialogForm={UserForm} record_id={access.id} label="Edit" css="p-3 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white rounded-lg"/>
                            <ButtonDelete/>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}