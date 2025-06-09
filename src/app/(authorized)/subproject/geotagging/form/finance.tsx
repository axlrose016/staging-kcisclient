import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Finance({errors} : ErrorProps){
    return (
        <>
            <Label className="text-md font-semibold text-gray-900 mb-2">MIBF / MF Cost and ERFR Release Information</Label>
            <div className="flex grid col-span-3 sm:grid-cols-4">
                <div className="p-2">
                    <Label className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">KC Grant Amount</Label>
                    <Input id="no_children" name="no_children" type="number" placeholder="Enter Number of Children" />
                </div>
                <div className="p-2">
                    <Label className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">KALAHI Actual Amount</Label>
                    <Input id="no_children" name="no_children" type="number" placeholder="Enter Number of Children" />
                </div>
            </div>
            <div className="flex grid col-span-3 sm:grid-cols-4">
                <div className="flex items-center space-x-2 m-2">
                    <Checkbox id="terms2" className="mr-2" />
                    <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        With Local Counterpart (Financial)?
                    </Label>
                </div>
            </div>
            <div className="flex grid col-span-3 sm:grid-cols-4">
                <div className="p-2">
                    <Label className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">LCC Amount (MIBF)</Label>
                    <Input id="no_children" name="no_children" type="number" placeholder="Enter Number of Children" />
                </div>
                <div className="p-2">
                    <Label className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">LCC Actual Amount</Label>
                    <Input id="no_children" name="no_children" type="number" placeholder="Enter Number of Children" />
                </div>
                <div className="p-2">
                    <Label className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Operation and Maintenance Cost</Label>
                    <Input id="no_children" name="no_children" type="number" placeholder="Enter Number of Children" />
                </div>
            </div>
        </>
    )
}