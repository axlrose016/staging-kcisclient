import { ButtonDelete } from "@/components/actions/button-delete"
import { ButtonEdit } from "@/components/actions/button-edit"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  
  const subprojects = [
    {
      id: "SP001",
      sub_project_name: "Road",
      status: "Ongoing",
      fund_source: "Pagkilos",
    },
    {
      id: "SP002",
      sub_project_name: "Bridge",
      status: "Completed",
      fund_source: "NCDDP-AF",
    },
    {
      id: "SP003",
      sub_project_name: "Health Center",
      status: "Completed",
      fund_source: "NCDDP-AF",
    },
    {
      id: "SP004",
      sub_project_name: "Day Care Center",
      status: "Completed",
      fund_source: "Pagkilos",
    },
    {
      id: "INV005",
      sub_project_name: "Road",
      status: "Waived",
      fund_source: "NCDDP-AF",
    }
  ]
  
  export default function Geotagging() {
    return (
      <Table className="table-fixed w-full text-left">
            <TableCaption>A list of all Sub Projects.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[400px]">Sub Project Name</TableHead>
                <TableHead className="w-[200px]">Status</TableHead>
                <TableHead className="w-[200px]">Fund Source</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subprojects.map((subproject:any) => (
                <TableRow key={subproject.id}>
                  <TableCell className="font-medium">{subproject.sub_project_name}</TableCell>
                  <TableCell className="font-medium">{subproject.status}</TableCell>
                  <TableCell className="font-medium">{subproject.fund_source}</TableCell>
                  <TableCell className="text-right">
                    <ButtonEdit/>
                    <ButtonDelete/>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
      </Table>
    )
  }
  