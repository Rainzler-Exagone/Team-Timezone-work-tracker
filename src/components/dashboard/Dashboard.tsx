import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { MemberType } from "@/types/teamTypes"
import AddMember from "./AddMember"
import useTeamStore from "@/store/teamStore"
import { getWorkStatus } from "@/utils/timeUtils"
// Define MemberType




// Define columns
export const columns: ColumnDef<MemberType>[] = [
  {
    id: "select",

    cell: ({ row }) => (
      <Avatar>
        <AvatarImage src={"https://github.com/shadcn.png"} alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "location",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Location <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className="">{row.getValue("location")}</div>,
  },
  {
    accessorKey: "timezone",
    header: "Time Zone",
    cell: ({ row }) => <div className="capitalize">{row.getValue("timezone")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className={`capitalize ${row.getValue("status") === "working" ? "text-green-500" : "text-red-500"}`}>
        {row.getValue("status")}
      </div>
    ),
  },
  {
    accessorKey: "currentTime",
    header: "Current Time",
    cell: ({ row }) => <div className="capitalize">{row.getValue("currentTime")}</div>,
  },
  {
    accessorKey: "contractType",
    header: "Contract Type",
    cell: ({ row }) => <div className="capitalize">{row.getValue("contractType")}</div>,
  },
  {
    accessorKey: "workingHours",
    header: "Working Hours",
    cell: ({ row }) => {
      const workingHours = row.getValue("workingHours");
      return (
        <div className="capitalize">
          {workingHours ? `${workingHours.From!} - ${workingHours.To!}` : "N/A"}
        </div>
      );
    },
  },
  {
    accessorKey: "LocalWorkHours",
    header: "Local Working Hours",
    cell: ({ row }) => {
      const LocalWorkHours = row.getValue("LocalWorkHours");
      return (
        <div className="capitalize">
          {LocalWorkHours ? `${LocalWorkHours.From!} - ${LocalWorkHours.To!}` : "Not yet specified"}
        </div>
      );
    },
  }

]

export default function MembersTable() {

  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [members, setMembers] = useState<any[]>([]);
  // Sample data
  useEffect(() => {
    const storedMembers = localStorage.getItem("team-storage");
    const members = storedMembers ? JSON.parse(storedMembers) : [];
    setMembers(members.state.team);
  }, []);

  console.log(members);


  const { removeMember } = useTeamStore()
  const table = useReactTable({
    data: members,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="w-auto">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter locations..."
          value={(table.getColumn("location")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("location")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <AddMember />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value: any) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}

                    </TableCell>
                  ))}
                  <TableCell> {/* This is the cell containing the delete button */}
                    <Button className="mt-2 mx-4" variant={"destructive"} onClick={() => removeMember(row.original.id)}>
                      Delete {/* This is the delete button */}
                        
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
