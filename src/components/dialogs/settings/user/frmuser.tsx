import { ButtonSubmit } from "@/components/actions/button-submit";
import { Button } from "@/components/ui/button";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DialogClose, DialogTitle } from "@radix-ui/react-dialog";
import { FormEvent, useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { FormDropDown } from "@/components/forms/form-dropdown";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { getRoleLibraryOptions } from "@/components/_dal/options";
import { fetchUser } from "@/components/_dal/users";
import { IUser } from "@/components/interfaces/iuser";
import UserAccess from "./frmuseraccess";
import { submit } from "./actions";
import { z } from "zod";
import { toast } from "@/hooks/use-toast";
import { Controller, useForm } from "react-hook-form";
import { formDefaultValues, formSchema, FormSchema } from "./userSchema";
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import LoadingScreen from "@/components/general/loading-screen";

export default function UserForm({
    className,
    record_id,
    ...props
}:  React.ComponentProps<"div"> & {record_id: string}){
    const [formUser, setFormUser] = useState<IUser>();
    const [state, submitAction] = useActionState(submit, undefined);
    const [roleOptions, setRoleOptions] = useState<LibraryOption[]>([]);
    const [selectedRole, setSelectedRole] = useState("");
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [user, role] = await Promise.all([
                    fetchUser(record_id, "id"),
                    getRoleLibraryOptions(),
                ]);
                setRoleOptions(role);
                const fetchedUser = user[0];
                setFormUser(fetchedUser);
                setSelectedRole(fetchedUser.role_id);
                setLoading(false);
    
                // Log the fetched data immediately after setting state
                console.log("Fetched User", fetchedUser);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
    
        fetchData();
    }, [record_id]);

    useEffect(() => {
        if (formUser) {
            console.log("Form User", formUser);
        }
    }, [formUser]);
    
    if (loading) {
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

    const handleRoleChange = (id: any) => {
        const selectedRoleId = roleOptions.filter(w => w.id === id).map(m => m.id)[0];
        setSelectedRole(selectedRoleId);
        if(formUser){
            setFormUser({
                ...formUser,
                role_id: selectedRoleId
            })
            console.log("Updated User: ", formUser)
        }
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const formData = new FormData;

        if (formUser) {
            formData.append('id', formUser.id);
            formData.append('username', formUser.username);
            formData.append('email', formUser.email);
            formData.append('role_id', selectedRole);
        }
        const result = await submit(formUser,formData);
         console.log("RESULT: ",result)
            if (result?.success) {
                toast({
                    variant: "green",
                    title: "Success.",
                    description: `${result.message}`,
                  })
            } else {
                if (result?.errors) {
                  Object.keys(result?.errors).forEach((fieldName) => {
                    const fieldErrors = result?.errors?[fieldName] : null;
                    if(fieldErrors != null){
                        fieldErrors.forEach((errorMessage:string) => {
                        toast({
                            variant: "destructive",
                            title: `${fieldName} Error`,
                            description: errorMessage,
                        });
                    });
                    }
                  });
                } else {
                  toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: result?.message,
                  });
                }
            }
        };

    return (
        <>
            <form action={submitAction} className="p-6 md:p-8">
                <div className={cn("flex flex-col overflow-auto max-h-[80vh] scrollbar-hide p-4", className)} {...props}>
                    <div className="grid md:grid-rows-1 sm:grid-cols-3 sm:grid-rows-1 mb-2">
                        <div className="flex items-center justify-center row-span-1 sm:row-span-2 sm:col-span-1">
                            <div className="w-full p-2">   
                                <label htmlFor="username" className="block text-sm/6 form-medium text-gray-900">
                                    Username
                                </label>
                                <div className="mt-2">
                                    <Input id="username" type="text" name="username" defaultValue={formUser?.username} placeholder="Juan D. Dragon" required/>
                                </div>   
                                {state?.errors?.username && <p>{state.errors.username}</p>}
                            </div>
                        </div>
                        <div className="flex items-center justify-center row-span-1 sm:row-span-2 sm:col-span-1">
                            <div className="w-full p-2">
                                <label htmlFor="email" className="block text-sm/6 form-medium text-gray-900">
                                    Email
                                </label>
                                <div className="mt-2">
                                    <Input id="email" type="email" name="email" defaultValue={formUser?.email} placeholder="email@example.com" required/>
                                </div>
                                {state?.errors?.email && <p>{state.errors.email}</p>}
                            </div>
                        </div>
                        <div className="flex items-center justify-center row-span-1 sm:row-span-2 sm:col-span-1">
                            <div className="w-full p-2">
                                <label htmlFor="email" className="block text-sm/6 form-medium text-gray-900">
                                    Role
                                </label>
                                <div className="mt-2">
                                    <FormDropDown
                                        id="role_id"
                                        options={roleOptions}
                                        selectedOption={formUser?.role_id || ''}
                                        onChange={handleRoleChange}
                                    />
                                </div>
                                {state?.errors?.role_id && <p>{state.errors.role_id}</p>}
                            </div>
                        </div>
                    </div>
                    <UserAccess record_id={record_id}/>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="destructive">
                            Cancel
                        </Button>
                    </DialogClose>
                    <ButtonSubmit label={loading ? "Saving..." : "Save"} disabled={loading}/>                
                </DialogFooter>
            </form>
        </>
    )
}