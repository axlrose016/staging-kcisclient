"use client"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";
import LoginService from "@/app/login/LoginService"
import { getSession } from '@/lib/sessions-client';
import { SessionPayload } from '@/types/globals';
import React, { useState } from "react";
import { useRouter } from "next/navigation"
import { deleteSession } from "@/lib/sessions-client"
import { toast } from "@/hooks/use-toast";
const _session = await getSession() as SessionPayload;
type ChangePasswordProps = {
    newPassword: string;
    email: string;
    currentPassword: string;
    retypePassword: string;
}
export default function AccountPage() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const handleLogout = async () => {
        try {
            await deleteSession();
            window.location.href = '/login';
            //router.push('/login');
            console.log('URL updated, but waiting for navigation');
        } catch (error) {
            console.error("Failed to log out:", error);
        }
    };

    const [changePassword, setChangePassword] = React.useState<ChangePasswordProps>({
        newPassword: "",
        email: "",
        currentPassword: "",
        retypePassword: "",

    });
    const handleChangePassword = async () => {
        setIsLoading(true)
        if (!changePassword.currentPassword || !changePassword.newPassword || !changePassword.retypePassword) {
            toast({
                variant: "destructive",
                title: "Incomplete Submission",
                description: "Some required fields are missing. Please fill out all necessary details before continuing.",
            });
            setIsLoading(false)
            return;


        }
        if (changePassword.newPassword.length <= 7) {
            toast({
                variant: "destructive",
                title: "Weak Password",
                description: "Your password must be at least 8 characters long.",
            });
            setIsLoading(false)
            return;
        }
        if (changePassword.newPassword != changePassword.retypePassword) {
            toast({
                variant: "destructive",
                title: "Passwords Do Not Match",
                description: "Please make sure the password and confirmation fields are identical.",
            });
            setIsLoading(false)
            return;

        }

        if (changePassword.currentPassword == changePassword.newPassword) {
            toast({
                variant: "destructive",
                title: "Same Password",
                description: "Your new password must be different from your current password.",
            });
            setIsLoading(false)
            return;

        }
        const hasUppercase = /[A-Z]/.test(changePassword.newPassword);
        const hasLowercase = /[a-z]/.test(changePassword.newPassword);
        const hasNumber = /[0-9]/.test(changePassword.newPassword);
        const hasSpecialChar = /[^A-Za-z0-9]/.test(changePassword.newPassword);

        if (!hasUppercase) {
            toast({
                variant: "destructive",
                title: "Missing Uppercase Letter",
                description: "Your password must contain at least one uppercase letter.",
            });
            setIsLoading(false);
            return;
        }
        if (!hasLowercase) {
            toast({
                variant: "destructive",
                title: "Missing Lowercase Letter",
                description: "Your password must contain at least one lowercase letter.",
            });
            setIsLoading(false);
            return;
        }
        if (!hasNumber) {
            toast({
                variant: "destructive",
                title: "Missing Number",
                description: "Your password must contain at least one number.",
            });
            setIsLoading(false);
            return;
        }
        if (!hasSpecialChar) {
            toast({
                variant: "destructive",
                title: "Missing Special Character",
                description: "Your password must contain at least one special character.",
            });
            setIsLoading(false);
            return;
        }
        async function doChangePassword() {
            try {
                const fetchData = async (endpoint: string) => {


                    try {
                        debugger;
                        const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");

                        const response = await fetch(endpoint, {
                            method: "POST",
                            headers: {
                                Authorization: `bearer ${onlinePayload.token}`,
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({

                                "email": _session.userData.email,
                                "current_password": changePassword.currentPassword,
                                "new_password": changePassword.newPassword

                            })
                        });

                        if (!response.ok) {
                            const data = await response.json();
                            console.log("Error message ", data)
                            toast({
                                variant: "destructive",
                                title: "Invalid Password",
                                description: data.error,
                            });
                            setIsLoading(false)
                            // console.log(response);

                        } else {
                            toast({
                                variant: "green", // use "success" instead of "green" if your toast system supports it
                                title: "Password Changed Successfully",
                                description: "You’ll be redirected to the login page shortly.",
                            });

                            setTimeout(() => {
                                handleLogout();
                            }, 2000); // waits for 2000 milliseconds (2 seconds)

                            const data = await response.json();
                            console.log("🗣️Change password from api ", data.data);


                        }
                    } catch (error: any) {
                        if (error.name === "AbortError") {
                            console.log("Request canceled", error.message);
                            alert("Request canceled" + error.message);
                        } else {
                            console.error("Error fetching data:", error);
                            alert("Error fetching data:" + error);
                        }
                    }
                };

                fetchData(process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + "auth_users/update/password/");
            } catch (error) {
                console.error(error);
            } finally {

            }
        }
        doChangePassword();
    }
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            {/* {_session.userData.email}
            {changePassword.email}
            {changePassword.newPassword}
            {changePassword.currentPassword} */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl flex items-center gap-2">
                        <Lock />
                        Change Password
                    </CardTitle>
                    <Alert variant="default" className="mt-2">
                        <AlertTitle className="mb-2">Password Requirements</AlertTitle>
                        <AlertDescription>
                            Please enter your current password and a new password to change your account password.
                            <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground">
                                <li>New password must be at least 8 characters long.</li>
                                <li>Include both uppercase and lowercase letters.</li>
                                <li>Add at least one number and one special character.</li>
                                <li>Do not reuse your previous passwords.</li>
                                <li>Remember your new passwords.</li>
                                <li>Avoid using easily guessable information, such as birthdays or names.</li>
                            </ul>
                        </AlertDescription>
                    </Alert>
                </CardHeader>
                <CardContent>
                    <form onSubmit={(e) => {
                        e.preventDefault();

                        handleChangePassword();

                    }}>
                        <div className="flex flex-col gap-6">
                            <div className="grid gap-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input
                                    id="current-password"
                                    type="password"
                                    placeholder="Enter current password"
                                    value={changePassword.currentPassword}
                                    onChange={(e) => setChangePassword({ ...changePassword, currentPassword: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input
                                    id="new-password"
                                    type="password"
                                    placeholder="Enter new password"
                                    required
                                    value={changePassword.newPassword}
                                    onChange={(e) => setChangePassword({ ...changePassword, newPassword: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="retype-password">Retype New Password</Label>
                                <Input
                                    id="retype-password"
                                    type="password"
                                    placeholder="Retype new password"
                                    required
                                    value={changePassword.retypePassword}
                                    onChange={(e) => setChangePassword({ ...changePassword, retypePassword: e.target.value })}
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <svg
                                        className="animate-spin h-5 w-5 mr-3 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8.009 8.009 0 0 1 12 20Z"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 mr-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        strokeWidth={2}
                                    >
                                        <rect width="18" height="11" x="3" y="11" rx="2" />
                                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                    </svg>
                                )} Confirm Password Change
                            </Button>
                        </div>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}