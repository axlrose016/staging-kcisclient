import { cn } from "@/lib/utils"
import { Slider } from "@/components/ui/slider"
import { useState } from "react"
import { Label } from "@radix-ui/react-label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"


export default function Skills({ errors }: ErrorProps) {
    const [value, setValue] = useState(5)

    return (

        <>
            <div  >
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 gap-[10px]">
                    <div className="p-2 col-span-4">
                        <Label htmlFor="skills" className="block text-sm font-medium">Year Graduated</Label>
                        <Textarea
                            id="skills"
                            name="skills"
                            placeholder="Enter your skills"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.skills && (
                            <p className="mt-2 text-sm text-red-500">{errors.skills[0]}</p>
                        )}

                    </div>
                    {/* <div className="p-2 sm:col-span-2">
                        <div className="mb-2 flex justify-between">
                            <span className="text-sm font-medium">Computer Proficiency</span>
                            <span className="text-sm font-medium">{value} / 10</span>
                        </div>
                        <Slider
                            defaultValue={[5]}
                            max={10}
                            step={1}
                            className={cn("mb-2", className)}
                            onValueChange={(vals) => setValue(vals[0])}

                        />
                        <div className="flex justify-between">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <span key={num} className="text-xs">
                                    {num}
                                </span>
                            ))}
                        </div>
                        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

                    </div>
                    <div className="p-2 sm:col-span-2">
                        <div className="mb-2 flex justify-between">
                            <span className="text-sm font-medium">Administrative Work</span>
                            <span className="text-sm font-medium">{value} / 10</span>
                        </div>
                        <Slider
                            defaultValue={[5]}
                            max={10}
                            step={1}
                            className={cn("mb-2", className)}
                            onValueChange={(vals) => setValue(vals[0])}

                        />
                        <div className="flex justify-between">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <span key={num} className="text-xs">
                                    {num}
                                </span>
                            ))}
                        </div>
                        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

                    </div>
                    <div className="p-2 sm:col-span-2">
                        <div className="mb-2 flex justify-between">
                            <span className="text-sm font-medium">Communication Skills</span>
                            <span className="text-sm font-medium">{value} / 10</span>
                        </div>
                        <Slider
                            defaultValue={[5]}
                            max={10}
                            step={1}
                            className={cn("mb-2", className)}
                            onValueChange={(vals) => setValue(vals[0])}

                        />
                        <div className="flex justify-between">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <span key={num} className="text-xs">
                                    {num}
                                </span>
                            ))}
                        </div>
                        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

                    </div>
                    <div className="p-2 sm:col-span-2">
                        <div className="mb-2 flex justify-between">
                            <span className="text-sm font-medium">Problem-solving Skills</span>
                            <span className="text-sm font-medium">{value} / 10</span>
                        </div>
                        <Slider
                            defaultValue={[5]}
                            max={10}
                            step={1}
                            className={cn("mb-2", className)}
                            onValueChange={(vals) => setValue(vals[0])}

                        />
                        <div className="flex justify-between">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <span key={num} className="text-xs">
                                    {num}
                                </span>
                            ))}
                        </div>
                        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

                    </div> */}
                </div>
            </div>
        </>
    )
}

