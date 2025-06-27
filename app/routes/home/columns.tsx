import { type ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Form } from "react-router";
import type { Application } from "./types";
import { getStatusBadge, getSystemTypeLabel } from "./utils";

// Define columns for the data table
export const columns: ColumnDef<Application>[] = [
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
          <Form
            method="delete"
            navigate={false}
            onSubmit={(event) => {
              if (!confirm("Are you sure you want to delete this application?")) {
                event.preventDefault();
              }
            }}
          >
            <input type="hidden" name="id" value={application.id} />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </Form>
        </div>
      );
    },
  },
]; 