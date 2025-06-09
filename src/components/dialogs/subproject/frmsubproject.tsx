"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogFooter, DialogHeader } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DialogClose, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Tabs } from "@radix-ui/react-tabs";
import { useActionState } from "react";
import { submit } from "./actions";

export default function SubProjectForm(){
      const [state, submitAction] = useActionState(submit, undefined)
    
    return(
        <>
            <DialogHeader>
                <DialogTitle><Label style={{fontSize:20}}>Sub Project Intake</Label></DialogTitle>
                <DialogDescription>
                    Add Form Description or other reminders.    
                </DialogDescription>
            </DialogHeader>
            <form action={submitAction}>
            <Tabs defaultValue="details" className="w-full">
                {/* Responsive Tab List */}
                <TabsList>
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="financial">Financial Information</TabsTrigger>
                    <TabsTrigger value="physical">Physical Accomplishment</TabsTrigger>
                </TabsList>

                {/* Tab Contents */}
                <TabsContent className="w-full" value="account">
                    
                </TabsContent>
                <TabsContent value="password">
                    <div>Content for Password tab</div>
                </TabsContent>
                <TabsContent value="password5">
                    <div>Content for Password 5 tab</div>
                </TabsContent>
            </Tabs>
            </form>
            <DialogFooter>
                <DialogClose asChild>
                <Button type="button" variant="secondary">
                    Close
                </Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
            </DialogFooter>
        </>
    )
}