"use client"

import { cn, hashPassword } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ButtonSubmit } from "@/components/actions/button-submit"
import { ButtonDialog } from "@/components/actions/button-dialog"
import RegistrationForm from "@/components/dialogs/registration/frmregistration"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { getUserByEmail, getUserById, getUserData, getUsers } from "@/db/offline/Dexie/schema/user-service"
import { toast } from "@/hooks/use-toast"
import { IUserData } from "@/components/interfaces/iuser"
import { createSession } from "@/lib/sessions-client"
import { redirect } from "next/navigation"

const formSchema = z.object({
    email: z.string().email({message:"Invalid Email Address"}).trim(),
    password: z
        .string()
        .min(8, {message:"Password must be at least 8 characters"})
        .trim(),
});

type FormData = z.infer<typeof formSchema>
export default function LoginForm({className,...props}: React.ComponentProps<"div">) {

  //const [state, loginAction] = useActionState(login, undefined)
  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })


  const onSubmit = async (data: FormData) => {
    try{
      const user = await getUserByEmail(data.email);
      if(user == null){
        toast({
          variant: "destructive",
          title: "No Record Found!",
          description: "The Email was not found on the database, Please try again!",
        })
      }
      const decryptedPassword = await hashPassword(data.password, user?.salt);
      if(user?.password === decryptedPassword && user.email === data.email)
      {
        let userData: IUserData | null; 
        userData = await getUserData(user.id);
        toast({
          variant: "green",
          title: "Success.",
          description: "Welcome to KCIS!",
        })
        if(userData == null){
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem during your login process, Please try again!",
          })
          return;
        }
        await createSession(user.id, userData, 'abc123');
        redirect("/")
      }
      else{
        toast({
          variant: "destructive",
          title: "No Record Found!",
          description: "The Email or Password is Incorrect, Please try again!",
        })
      }
    }
    catch(error){
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem during your login process, Please try again!",
      })
    }
  }
  
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-balance text-muted-foreground">
                  Login to your Acme Inc account
                </p>
              </div>
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
              </div>
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" {...register("password")} name="password" required />
              </div>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              <ButtonSubmit label="Login"/>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <ButtonDialog dialogForm={RegistrationForm} label="Register" dialog_title="Welcome to KALAHI-CIDSS Information System" css="underline underline-offset-4 cursor-pointer"/>
              </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/placeholder.svg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}