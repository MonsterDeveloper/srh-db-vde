import { TrendingUp, TrendingDown, FileText, Clock, CheckCircle, Users, MoreHorizontal, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Columns, Trash2, Plus } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import * as React from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { Link, useLoaderData } from "react-router";
import { eq } from "drizzle-orm";
import { applications, persons, companies, plants, addresses } from "~/database/schema";

import type { Route } from "./+types/home";

export function meta() {
  return [
    { title: "SRH DB VDE - Dashboard" },
  ];
}

// Loader function to fetch data from the database
export async function loader({ context }: Route.LoaderArgs) {
  const { database } = context;
  
  // Fetch applications with related data
  const applicationsData = await database
    .select({
      id: applications.id,
      systemType: applications.systemType,
      status: applications.status,
      submissionDate: applications.submissionDate,
      place: applications.place,
      subscriberFirstName: persons.firstName,
      subscriberLastName: persons.lastName,
      installerName: companies.name,
      plantAddress: addresses.city,
    })
    .from(applications)
    .leftJoin(persons, eq(applications.subscriberId, persons.id))
    .leftJoin(companies, eq(applications.installerId, companies.id))
    .leftJoin(plants, eq(applications.plantId, plants.id))
    .leftJoin(addresses, eq(plants.addressId, addresses.id))
    .orderBy(applications.submissionDate);

  return {
    applications: applicationsData.map(app => ({
      id: app.id.toString(),
      systemType: app.systemType as "new_construction" | "extension" | "dismantling",
      status: app.status as "draft" | "pending" | "under_review" | "approved" | "rejected" | "completed",
      submissionDate: new Date(app.submissionDate),
      place: app.place || app.plantAddress || "N/A",
      subscriber: `${app.subscriberFirstName || ""} ${app.subscriberLastName || ""}`.trim() || "N/A",
      installer: app.installerName || "N/A",
    }))
  };
}

// Define the application type
type Application = {
  id: string;
  systemType: "new_construction" | "extension" | "dismantling";
  status: "draft" | "pending" | "under_review" | "approved" | "rejected" | "completed";
  submissionDate: Date;
  place: string;
  subscriber: string;
  installer: string;
};

function SectionCards({ applications }: { applications: Application[] }) {
  const totalApplications = applications.length;
  const pendingReviews = applications.filter(app => 
    app.status === "pending" || app.status === "under_review"
  ).length;
  const approvedThisMonth = applications.filter(app => 
    app.status === "approved" && app.submissionDate.getMonth() === new Date().getMonth()
  ).length;
  const completedApplications = applications.filter(app => 
    app.status === "completed"
  ).length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalApplications}</div>
          <p className="text-xs text-muted-foreground">
            +2 from last month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingReviews}</div>
          <p className="text-xs text-muted-foreground">
            Require attention
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Approved This Month</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{approvedThisMonth}</div>
          <p className="text-xs text-muted-foreground">
            +25% from last month
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completed</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedApplications}</div>
          <p className="text-xs text-muted-foreground">
            Fully processed
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function getStatusBadge(status: string) {
  const statusConfig = {
    draft: { variant: "secondary" as const, label: "Draft" },
    pending: { variant: "outline" as const, label: "Pending" },
    under_review: { variant: "default" as const, label: "Under Review" },
    approved: { variant: "default" as const, label: "Approved" },
    rejected: { variant: "destructive" as const, label: "Rejected" },
    completed: { variant: "default" as const, label: "Completed" },
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  return (
    <Badge variant={config.variant}>
      {config.label}
    </Badge>
  );
}

function getSystemTypeLabel(type: string) {
  const typeLabels = {
    new_construction: "New Construction",
    extension: "Extension",
    dismantling: "Dismantling",
  };
  return typeLabels[type as keyof typeof typeLabels] || type;
}

// Define columns for the data table
const columns: ColumnDef<Application>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("id")}</div>
    ),
    enableHiding: false,
  },
  {
    accessorKey: "systemType",
    header: "System Type",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {getSystemTypeLabel(row.getValue("systemType"))}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.getValue("status")),
  },
  {
    accessorKey: "submissionDate",
    header: "Submission Date",
    cell: ({ row }) => {
      const date = row.getValue("submissionDate") as Date;
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "subscriber",
    header: "Subscriber",
    cell: ({ row }) => <div>{row.getValue("subscriber")}</div>,
  },
  {
    accessorKey: "place",
    header: "Place",
    cell: ({ row }) => <div>{row.getValue("place")}</div>,
  },
  {
    accessorKey: "installer",
    header: "Installer",
    cell: ({ row }) => <div>{row.getValue("installer")}</div>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const application = row.original;
      
      return (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // Handle delete action
              console.log("Delete application:", application.id);
            }}
            className="text-red-600 hover:text-red-800 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

function DataTable({ data }: { data: Application[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Filter applications..."
            value={(table.getColumn("id")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("id")?.setFilterValue(event.target.value)
            }
            className="flex h-10 w-full max-w-sm rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-8"
              onChange={(e) => {
                const value = e.target.value;
                if (value === "all") {
                  table.getColumn("status")?.setFilterValue(undefined);
                } else {
                  table.getColumn("status")?.setFilterValue(value);
                }
              }}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-10"
              >
                <Columns className="h-4 w-4" />
                Columns
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="default" size="sm" className="h-10" asChild>
            <Link to="/new" prefetch="intent">
            <Plus className="h-4 w-4" />
            New Application</Link>
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">Rows per page</p>
                         <select
               className="flex h-8 w-16 items-center justify-between rounded-md border border-input bg-background px-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
               value={table.getState().pagination.pageSize}
               onChange={(e) => {
                 table.setPageSize(Number(e.target.value));
               }}
             >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex w-24 items-center justify-center text-sm font-medium">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to first page</span>
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">Go to previous page</span>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to next page</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">Go to last page</span>
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { applications } = useLoaderData<typeof loader>();

  return (
    <div className="flex-1 space-y-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <SectionCards applications={applications} />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">VDE Applications</h2>
        </div>
        
        <DataTable data={applications} />
      </div>
    </div>
  );
}
