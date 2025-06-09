import type React from "react"
import type { LibraryOption } from "../interfaces/library-interface"

interface FormDropDownProps {
  options: LibraryOption[]
  selectedOption: any | null
  label?: string
  id?: string
  onChange: (id: any) => void
  name: string
}

export function FormDropDownv2({ options, selectedOption, label, onChange, id, name }: FormDropDownProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = id;
    onChange(selectedId)
  }

  return (
    <div className="w-full">
      <select
        id={id}
        name={name}
        value={selectedOption || ""}
        onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      >
        <option value="">{label || "Select an option"}</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  )
}

