import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";

export default function SPCR({errors} : ErrorProps){
    return (
        <>
            <Label className="text-md font-semibold text-gray-900 mb-2">Project Beneficiaries (Actual)</Label>
            <div className="flex grid col-span-3 sm:grid-cols-4">
                <div className="p-2">
                    <Label className="text-sm font-semibold text-gray-900 mb-2">Total Number of Beneficiaries</Label>
                </div>
                <div className="p-2">
                    <Label className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Households</Label>
                    <Input id="no_children" name="no_children" type="number" placeholder="Enter Number of Children" />
                </div>
                <div className="p-2">
                    <Label className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Families</Label>
                    <Input id="no_children" name="no_children" type="number" placeholder="Enter Number of Children" />
                </div>
            </div>
            <div className="flex grid col-span-3 sm:grid-cols-4">
                <div className="p-2">
                    <Label className="text-sm font-semibold text-gray-900 mb-2">Total Pantawid Beneficiaries</Label>
                </div>
                <div className="p-2">
                    <Label className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Households</Label>
                    <Input id="no_children" name="no_children" type="number" placeholder="Enter Number of Children" />
                </div>
                <div className="p-2">
                    <Label className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Families</Label>
                    <Input id="no_children" name="no_children" type="number" placeholder="Enter Number of Children" />
                </div>
            </div>
            <div className="flex grid col-span-3 sm:grid-cols-4">
                <div className="p-2">
                    <Label className="text-sm font-semibold text-gray-900 mb-2">Total SLP Beneficiaries</Label>
                </div>
                <div className="p-2">
                    <Label className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Households</Label>
                    <Input id="no_children" name="no_children" type="number" placeholder="Enter Number of Children" />
                </div>
                <div className="p-2">
                    <Label className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Families</Label>
                    <Input id="no_children" name="no_children" type="number" placeholder="Enter Number of Children" />
                </div>
            </div>
            <div className="flex grid col-span-3 sm:grid-cols-4">
                <div className="p-2">
                    <Label className="text-sm font-semibold text-gray-900 mb-2">Total IP Beneficiaries</Label>
                </div>
                <div className="p-2">
                    <Label className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Households</Label>
                    <Input id="no_children" name="no_children" type="number" placeholder="Enter Number of Children" />
                </div>
                <div className="p-2">
                    <Label className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Families</Label>
                    <Input id="no_children" name="no_children" type="number" placeholder="Enter Number of Children" />
                </div>
            </div>
            <div className="flex grid col-span-3 sm:grid-cols-4">
                <div className="p-2">
                    <Label className="text-sm font-semibold text-gray-900 mb-2">Total Beneficiaries</Label>
                </div>
                <div className="p-2">
                    <Label className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Male</Label>
                    <Input id="no_children" name="no_children" type="number" placeholder="Enter Number of Children" />
                </div>
                <div className="p-2">
                    <Label className="mb-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Female</Label>
                    <Input id="no_children" name="no_children" type="number" placeholder="Enter Number of Children" />
                </div>
            </div>
        </>
    )
}  