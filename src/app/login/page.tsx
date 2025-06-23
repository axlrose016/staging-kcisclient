"use client"

import React, { useEffect, useState } from "react";
import { seedData } from "@/db/offline/Dexie/schema/library-service";
import { cn, ensureUint8Array, hashPassword } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ButtonSubmit } from "@/components/actions/button-submit"
import { ButtonDialog } from "@/components/actions/button-dialog"
import RegistrationForm from "@/components/dialogs/registration/frmregistration"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getUserAccessById, getUserByEmail, getUserById, getUserData, getUsers, seedUser, seedUserData } from "@/db/offline/Dexie/schema/user-service"
import { toast } from "@/hooks/use-toast"
import { IUserData } from "@/components/interfaces/iuser"
import { createSession } from "@/lib/sessions-client"
import { useRouter } from 'next/navigation'
import LoginService from "../../components/services/LoginService";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { useOnlineStatus } from "@/hooks/use-network";
import Captcha from "@/components/general/captcha";
import { Button } from "@/components/ui/button";
import { set } from "date-fns";
import UsersService from "@/components/services/UsersService";
import { cloneDeep } from "lodash";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { CustomDialog } from "@/components/ui/custom-dialog";
import Link from "next/link";


const formSchema = z.object({
  email: z.string().email({ message: "Invalid Email Address" }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .trim(),
});

type FormData = z.infer<typeof formSchema>


type ForgotPasswordProps = {
  email: string;
  birthdate: Date;
};
export default function LoginPage() {
  const [isShowForgotPassword, setIsShowForgotPassword] = useState(false);
  const [isLoadingResetButton, setIsLoadingResetButton] = useState(false);
  const isOnline = useOnlineStatus()
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [verified, setVerified] = useState<boolean>(false);
  const [verifiedResetPassword, setVerifiedResetPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [iAgreeForgotPassword, setIAgreeForgotPassword] = useState(false);
  const [showLoginButton, setShowLoginButton] = useState(false);
  const [forgotPassword, setForgotPassword] = useState<ForgotPasswordProps>({
    email: "",
    birthdate: new Date(),
  });
  const [showPassword, setShowPassword] = useState(false); // State for show password
  const [isShowReloginButton, setShowReloginButton] = useState(false)

  useEffect(() => {
    if (verifiedResetPassword) {
      setPageNo(3);
      setErrorMessage(false);
      setSuccessMessage(false);
      setIsLoadingResetButton(false);
    } else {
      setPageNo(2);
    }

  }, [verifiedResetPassword])
  const onHandleSubmitReset = async () => {
    // setIsLoadingResetButton(true)
    // setErrorMessage(false);
    // setSuccessMessage(true);

    // setIsLoadingResetButton(false);


    async function doResetPasswordFromForgotPassword() {
      try {
        const fetchData = async (endpoint: string) => {
          setIsLoadingResetButton(true);
          try {
            // debugger

            const response = await fetch(endpoint, {
              method: "POST",
              body: (() => {
                const formData = new FormData();
                formData.append("email", forgotPassword.email);
                formData.append("birthdate", forgotPassword.birthdate.toISOString().split('T')[0]);
                return formData;
              })(),
            });

            if (!response.ok) {
              setErrorMessage(true);
              setSuccessMessage(false);

              setShowReloginButton(false)
              console.log(response);
            } else {


              setShowReloginButton(true)
              const data = await response.json();
              console.log("data from api ", data.data);

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

        fetchData(process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + "forgot_password/");
      } catch (error) {
        console.error(error);
      }
    }
    doResetPasswordFromForgotPassword();
    // if (successMessage) {
    //   setShowLoginButton(true);
    //   setPageNo(4);
    // }
    // toast({
    //   variant: "green",
    //   title: "Success!",
    //   description: "Password reset instructions have been sent to your email.",
    // });
    // toast({
    //   variant: "destructive",
    //   title: "Account Not Found",
    //   description: "No matching account found for the email and birthdate provided. Please double-check your details or contact the system administrator.",
    // });
  }

  // useEffect(() => {
  //   setShowLoginButton(true);
  // }, [successMessage]);
  useEffect(() => {
    localStorage.removeItem("userIdViewOnly")
    localStorage.removeItem("person_profile")
    console.log("API: ", process.env.NEXT_PUBLIC_API_BASE_URL_KCIS)

    seedData();
    seedUserData();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({

    resolver: zodResolver(formSchema),
  })

  const offlineLogin = async (data: FormData) => {
    try {
      const user = await getUserByEmail(data.email);

      console.log('offlineLogin > user', { user, data })

      if (!user) {
        setIsLoading(false)
        return toast({
          variant: "destructive",
          title: "Incorrect Email and/or Password!",
          description: "The email and/or password you entered is incorrect. Please try again!",
        });
      }

      let safeSalt = user.salt;
      if (!(user.salt instanceof Uint8Array)) {
        safeSalt = ensureUint8Array(user.salt);
      }


      const decryptedPassword = await hashPassword(data.password, safeSalt);

      if (
        user.password !== decryptedPassword ||
        (user.email !== data.email && user.username !== data.email)
      ) {
        return toast({
          variant: "destructive",
          title: "Invalid Credentials!",
          description: "The email or password is incorrect. Please try again!",
        });
      }

      const userData: IUserData | null = await getUserData(user.id);

      if (!userData) {
        return toast({
          variant: "destructive",
          title: "Login Error!",
          description: "There was a problem during login. Please try again!",
        });
      }

      if (isOnline) {
        const userAccess = await getUserAccessById(user.id);
        if (userAccess) {

          const uploaded = await UsersService.syncUserData(user, userAccess);
          if (uploaded) {
            // saveUser();
          }
        }

      }

      // debugger
      await createSession(user.id, userData, "ABC123");
      // await createSession(user.id, userData, "ABC123");

      toast({
        variant: "green",
        title: "Success!",
        description: "Welcome to KCIS!",
      });

      // Redirect to the profile form if the user is not yet registered
      window.location.href = "/personprofile/form";
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Unexpected Error!",
        description: "An unexpected error occurred. Please try again later.",
      });
    }
  };

  const cleanNameToLowercase = (name: string): string => {
    return name.trim().replace(/\s+/g, ' ').toLowerCase();
  };

  // Example:
  // const rawName = " JOhn    Martin ";
  // const cleanedName = cleanNameToLowercase(rawName);

  // console.log(cleanedName); // Output: "john martin"



  const onSubmit = async (data: FormData) => {


    setIsLoading(true);
    debugger
    try {

      if (!verified) {
        toast({
          variant: "destructive",
          title: "Captcha Error!",
          description: "Invalid Captcha, Please try again!",
        });
        setIsLoading(false)
        return;
      }
      debugger
      if (isOnline) {
        const onlinePayload = await LoginService.onlineLogin(data.email, data.password);

        debugger;
        if (onlinePayload) {
          const raw = await LoginService.getProfile(onlinePayload.user.id, onlinePayload.token);
          const onlineProfile = await LoginService.getProfile(raw.id, onlinePayload.token);
          console.log('onlineProfile', onlineProfile)
          debugger
          if (onlineProfile) {

            const p = cloneDeep(onlineProfile)
            delete p.attachments
            delete p.cfw_assessment
            delete p.person_profile_cfw_fam_program_details
            delete p.person_profile_disability
            delete p.person_profile_engagement_history
            delete p.person_profile_family_composition
            delete p.person_profile_file_upload
            delete p.person_profile_sector

            await dexieDb.person_profile.put({ ...p })
            await dexieDb.person_profile_sector.bulkPut(onlineProfile.person_profile_sector)
            await dexieDb.person_profile_family_composition.bulkPut(onlineProfile.person_profile_family_composition)
            await dexieDb.person_profile_cfw_fam_program_details.bulkPut(onlineProfile.person_profile_cfw_fam_program_details)
            await dexieDb.person_profile_disability.bulkPut(onlineProfile.person_profile_disability)

            for (let index = 0; index < (onlineProfile.attachments as []).length; index++) {
              const element = onlineProfile.attachments[index];
              if (element._id) {
                await dexieDb.attachments.put({
                  ...onlineProfile.attachments[index],
                  id: onlineProfile.attachments[index]._id
                })
              } else {
                await dexieDb.attachments.put(onlineProfile.attachments[index])
              }
            }
            // // save to dexie
            // dexieDb.open();
            // dexieDb.transaction('rw', [
            //   dexieDb.person_profile,
            //   dexieDb.person_profile_sector,
            //   dexieDb.person_profile_disability,
            //   dexieDb.person_profile_family_composition,
            //   dexieDb.attachments,
            //   dexieDb.person_profile_cfw_fam_program_details], async () => {
            //     try {
            //       const existingRecord = await dexieDb.person_profile.get(onlineProfile.id);

            //       await dexieDb.person_profile.update(onlineProfile.id, onlineProfile);
            //       await dexieDb.person_profile_sector.bulkPut(onlineProfile.person_profile_sector);
            //       await dexieDb.person_profile_disability.bulkPut(onlineProfile.person_profile_disability ?? []);
            //       await dexieDb.person_profile_family_composition.bulkPut(onlineProfile.person_profile_family_composition ?? []);
            //       await dexieDb.attachments.bulkPut(onlineProfile.attachments);
            //       await dexieDb.person_profile_cfw_fam_program_details.bulkPut(onlineProfile.person_profile_cfw_fam_program_details ?? []);


            //       if (existingRecord) {
            //         // debugger
            //         await dexieDb.person_profile.update(onlineProfile.id, onlineProfile);
            //         await dexieDb.person_profile_sector.bulkPut(onlineProfile.person_profile_sector);
            //         await dexieDb.person_profile_disability.bulkPut(onlineProfile.person_profile_disability ?? []);
            //         await dexieDb.person_profile_family_composition.bulkPut(onlineProfile.person_profile_family_composition ?? []);
            //         await dexieDb.attachments.bulkPut(onlineProfile.attachments);
            //         await dexieDb.person_profile_cfw_fam_program_details.bulkPut(onlineProfile.person_profile_cfw_fam_program_details ?? []);
            //         console.log("Record updated in DexieDB:", { id: onlineProfile.id, att });

            //       } else {

            //         if (onlineProfile.person_profile_disability.length !== 0) {
            //           await dexieDb.person_profile_disability.bulkPut(onlineProfile.person_profile_disability);
            //         }
            //         // debugger
            //         if (onlineProfile.person_profile_family_composition.length !== 0) {
            //           for (let i = 0; i < onlineProfile.person_profile_family_composition.length; i++) {
            //             const family = onlineProfile.person_profile_family_composition[i];
            //             await dexieDb.person_profile_family_composition.add(family); // Save the object without raw_id
            //           }
            //         }
            //         // debugger
            //         if (onlineProfile.person_profile_sector.length !== 0) {
            //           await dexieDb.person_profile_sector.bulkPut(onlineProfile.person_profile_sector);
            //         }

            //         if (onlineProfile.attachments.length !== 0) {
            //           await dexieDb.attachments.bulkPut(onlineProfile.attachments);
            //         }
            //         if (onlineProfile.person_profile_cfw_fam_program_details) {
            //           await dexieDb.person_profile_cfw_fam_program_details.bulkAdd(onlineProfile.person_profile_cfw_fam_program_details);
            //         }

            //         let p = onlineProfile

            //         delete p.person_profile_cfw_fam_program_details
            //         delete p.person_profile_family_composition
            //         delete p.person_profile_sector
            //         delete p.attachments

            //         await dexieDb.person_profile.add(p);
            //         // debugger
            //         console.log("➕New record added to DexieDB:", { id: onlineProfile.id, profile: p });
            //         // debugger
            //       }
            //     } catch (error) {
            //       setIsLoading(false)
            //       console.log("Error saving to DexieDB:", error);
            //     }
            //   });
            // // debugger 
          }
          debugger
          await createSession(onlinePayload.user.id, onlinePayload.user.userData, onlinePayload.token);
          toast({
            variant: "green",
            title: "Success!",
            description: "Welcome to KCIS!",
          });
          window.location.href = "/personprofile/form";
          return; // Exit after successful login
        }
      }

      // If online login fails or offline mode
      await offlineLogin(data);
    } catch (error) {
      setIsLoading(false)
      console.error("Login Error: ", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem during your login process. Please try again!",
      });
    }
  }

  const [testData, setTestData] = useState<any>(null);
  const [isVisi, setVisi] = useState(false);
  const handleOnClick = () => {
    setIsLoading(true)
    // const testData1 = testData;
    // const testDataFinal = cleanNameToLowercase(testData1);
    // setTestData(testDataFinal);
    // setVisi(true);
  }
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    // Reset error/success messages when pageNo changes in forgot password dialog
    setErrorMessage(false);
    setSuccessMessage(false);
    setIsLoadingResetButton(false);
    // setVerifiedResetPassword(false); 
    setIAgreeForgotPassword(false);
    setPageNo(pageNo)

  }, [pageNo])
  const handleCheckEmailAndBirthdate = () => {
    if (!forgotPassword.email || !forgotPassword.birthdate) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all fields."
      });
      return;
    }
    setPageNo(2)
  }
  return (
    // <div className="bg-[url('/assets/Backgrounds/DSWD-Virtual-Background-01.jpg')] bg-cover bg-center bg-no-repeat">
    <div className="min-h-screen w-full flex items-center justify-center">
      {/* <p className={`${isVisi == true ? "" : "hidden"}`}>Sorry Space, you dont have space here.</p>
      <pre className="bg-yellow-200">{testData}</pre>
      <div className="w-full h-screen flex">
        <Input
          type="text"
          value={testData}
          onChange={(e) => setTestData(e.target.value)}
        >

        </Input>
        <Button onClick={handleOnClick}>Click</Button>
      </div> */}
      <div className="w-full h-screen flex">
        {/* Left side with background image - takes full height */}
        <div className="relative hidden md:block md:w-7/12 bg-muted">
          <img
            src="/assets/Backgrounds/DSWD-Virtual-Background-01.jpg"
            alt="Background"
            className="absolute inset-0 h-full w-full object-cover object-left dark:brightness-[0.2] dark:grayscale"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-12 bg-black/30">
            <h1 className="text-4xl font-bold text-white mb-4">KALAHI-CIDSS</h1>
            <p className="text-xl text-white text-center">Information System for Community-Driven Development</p>
          </div>
        </div>

        {/* Right side with login form - takes full height */}
        <div className="w-full md:w-5/12 flex flex-col items-center justify-center p-6 md:p-12 bg-background">
          <div className="w-full max-w-md">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex flex-col items-center text-center mb-6">
                <h1 className="text-2xl font-bold">KALAHI-CIDSS Information System</h1>
                <p className="text-balance text-muted-foreground">Login to your registered account</p>
              </div>

              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    name="email"
                    placeholder="m@example.com"
                    className="lowercase"
                    required
                  />
                  {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                </div>

                <div className="grid gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <a onClick={() => {
                      setIsShowForgotPassword(true);
                      setIsLoadingResetButton(false);
                      setVerifiedResetPassword(false);
                      setErrorMessage(false);
                      setSuccessMessage(false);
                      setShowReloginButton(false)
                      setPageNo(1);
                    }} href="#" className="text-sm text-primary underline-offset-2 hover:underline">
                      Forgot your password?
                    </a>
                  </div>
                  <Input id="password" type="password" {...register("password")} name="password" required  className="normal-case"/>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {/* {showPassword ? "Hide" : "Show"} */}
                  </button>
                  {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                </div>

                {(!verified && <Captcha verified={setVerified} />)}

                <ButtonSubmit label="Login" disabled={isLoading} />
              </div>
            </form>

            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <ButtonDialog
                dialogForm={RegistrationForm}
                label="Register"
                dialog_title="Welcome to KALAHI-CIDSS Information System"
                css="underline underline-offset-4 cursor-pointer text-primary"
              />
             {/* <Link
                href="/sign-up/guest"
                className="text-sm text-blue-600 underline hover:text-blue-800"
              >
                Sign-Up
              </Link> */}
            </div>

            <div className="mt-8 text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
              By clicking continue, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
              .
            </div>
          </div>
        </div>
      </div>

      <CustomDialog

        trigger={() => setIsShowForgotPassword(true)}
        title="Basic Dialog"
        description="This is a basic dialog with a dimmed background."
        className="max-w-md"
        open={isShowForgotPassword}
        onOpenChange={setIsShowForgotPassword}
      >
        {/* <Dialog modal={false}> */}


        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="mb-3">Forgot Password {isShowReloginButton}</DialogTitle>
            <Alert variant="default" className="mb-2 mt-5 text-center bg-muted">
              <DialogDescription>
                {/* {forgotPassword.email}
                {forgotPassword.birthdate?.toString()} */}
                <span className="flex justify-center mb-2">

                  <Info className="h-10 w-10 text-muted-foreground" />
                </span>
                Please enter your registered email and birthdate to reset your password.<br />
                Your current password will be replaced with a new system-generated one, which will be sent to your email if your details match our records.
              </DialogDescription>
            </Alert>
          </DialogHeader>
          <div className={`grid gap-4  ${pageNo == 1 ? "" : "hidden"}`}>
            <div className="grid gap-4">
              <div className="flex flex-col gap-1">
                <Label htmlFor="email_forgot_password">Email</Label>
                <Input
                  id="email_forgot_password"
                  type="email"
                  className="mt-2 normal-case"
                  value={forgotPassword.email}
                  onChange={(e) => {
                    setForgotPassword({ ...forgotPassword, email: e.target.value })

                  }}
                />
              </div>
              <div className="flex flex-col gap-1 ">
                <Label htmlFor="birthdate_forgot_password">Birthdate (Month/day/year)</Label>
                <Input
                  type="date"
                  id="birthdate_forgot_password"
                  value={forgotPassword.birthdate ? forgotPassword.birthdate.toISOString().split('T')[0] : ""}
                  className="mt-2"
                  onChange={(e) => {
                    setForgotPassword({ ...forgotPassword, birthdate: e.target.value ? new Date(e.target.value) : new Date() })
                  }}
                />
                {/* <DatePicker
                  id="birthdate_forgot_password"
                  value={forgotPassword.birthdate}
                  onDateChange={(date) => {
                    setForgotPassword({ ...forgotPassword, birthdate: date })
                  }}
                /> */}

              </div>
            </div>
          </div>
          <div className={`grid gap-4  ${pageNo == 2 ? "" : "hidden"}`}>
            <div className="grid gap-4">
              <div className="flex flex-col gap-1">
                {(!verifiedResetPassword && <Captcha verified={setVerifiedResetPassword} />)}

              </div>

            </div>
          </div>
          <div className={`grid gap-4  ${errorMessage ? "" : "hidden"}`}>
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Alert variant="destructive" className="text-center">
                  <span className="font-semibold">Account Not Found</span>
                  <div className="text-sm">
                    No matching account found for the email and birthdate provided.
                    Please double-check your details or contact the system administrator.
                  </div>
                </Alert>
              </div>
            </div>
          </div>
          <div className={`grid gap-4  ${pageNo == 3 && !isShowReloginButton ? "" : "hidden"}`}>
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="terms"
                  checked={iAgreeForgotPassword}
                  onCheckedChange={(checked) => setIAgreeForgotPassword(!!checked)}
                />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I acknowledge and accept that my current password will be replaced with a new, system-generated password.
                </label>
              </div>
            </div>
          </div>

          <div className={`grid gap-4  ${successMessage ? "" : "hidden"}`}>
            <div className="grid gap-4">
              <div className="flex items-center gap-2">
                <Alert variant="success" className="text-center">
                  <span className="font-semibold">Success!</span>
                  <div className="text-sm">
                    A new, system-generated password has been sent to your registered email address.<br />
                    <span className="block mt-2">
                      Please check your inbox (and spam/junk folder) for further instructions.<br />
                      For your security, we recommend changing your password after logging in.
                    </span>
                  </div>
                </Alert>
              </div>
            </div>
          </div>


          <div className="grid gap-4 ">

            {/* {pageNo}  */}
            <div className="flex flex-col-2 gap-1 mt-2 ">
              {pageNo >= 2 && pageNo <= 3 && !isShowReloginButton && (

                <Button
                  className={`w-full `}
                  onClick={() => {
                    setPageNo(pageNo - 1);
                    setVerifiedResetPassword(false);
                  }}
                >Previous</Button>
              )
              }

              {pageNo === 1 && (
                <Button
                  className="w-full"
                  onClick={() => handleCheckEmailAndBirthdate()}
                >
                  Next
                </Button>
              )}
              {pageNo === 3 && !isShowReloginButton && (
                <Button
                  className="w-full"
                  disabled={!iAgreeForgotPassword || isLoadingResetButton}
                  onClick={() => {
                    setIsLoadingResetButton(true);
                    onHandleSubmitReset();
                    successMessage ? setPageNo(4) : "";
                  }}
                >
                  {isLoadingResetButton ? (
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
                  )}
                  Confirm Password Reset
                </Button>
              )}
              {isShowReloginButton && (
                <Button
                  className="w-full"
                  onClick={() => { location.reload() }}
                >
                  Login
                </Button>
              )}
            </div>

          </div>


          <DialogFooter className="flex flex-col gap-4">

            {/* {errorMessage && ( */}
            <div className="text-center w-full">


            </div>


            {/* Submit Button */}

            <div className="hidden">
              <Button
                type="submit"
                className="w-full"
                onClick={() => {
                  setIsLoadingResetButton(true);
                  onHandleSubmitReset();
                }}
                disabled={isLoadingResetButton}
              >
                {isLoadingResetButton ? (
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
                )}
                Confirm Password Reset
              </Button>
            </div>
          </DialogFooter>


        </DialogContent>

        {/* </Dialog> */}
      </CustomDialog>
      {/* <AlertDialog>
        <AlertDialogTrigger>Open</AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog> */}
    </div >
    // </div>
  )
}
