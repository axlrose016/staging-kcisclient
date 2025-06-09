import { Input } from "@/components/ui/input"
import type { FieldErrors, UseFormRegister } from "react-hook-form"

interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
}

interface PasswordFieldsProps {
  register: UseFormRegister<FormData>
  errors: FieldErrors<FormData>
}

export default function PasswordFields({ register, errors }: PasswordFieldsProps) {
  return (
    <>
      <div className="sm:col-span-4">
        <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
          Password
        </label>
        <div className="mt-2">
          <Input id="password" type="password" {...register("password")} />
        </div>
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>
      <div className="sm:col-span-4">
        <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900">
          Confirm Password
        </label>
        <div className="mt-2">
          <Input id="confirmPassword" type="password" {...register("confirmPassword")} />
        </div>
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
      </div>
    </>
  )
}

