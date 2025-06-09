"use client"

import { toast } from "@/hooks/use-toast";
import { updateLibrary } from "./actions";
import { Button } from "@/components/ui/button";

export default function UpdateLibraryPage(){
    const handleClick = async () => {
        try {
            const result = await updateLibrary(); // Call the updateLibrary function
            console.log("RESULT " + result)
            if (result.success) {
                // If successful, log success and display a toast or alert
                console.log("SUCCESS: " + result.message);
                toast({
                    variant: "green",
                    title: "Success.",
                    description: "Library Successfully Updated!",
                  })
            } else {
                // If failed, log failure and display a toast or alert
                console.log("FAILURE: " + result.message);
                toast({
                    variant: "destructive",
                    title: "Uh oh! Something went wrong.",
                    description: "There was a problem with your request.",
                  })
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    };
    return (
        <>
            <h1>Update Library</h1>
            <Button onClick={handleClick}>Update Library</Button>
        </>
    )
}