import { Badge } from "~/components/ui/badge";

export function getStatusBadge(status: string) {
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

export function getSystemTypeLabel(type: string) {
  const typeLabels = {
    new_construction: "New Construction",
    extension: "Extension",
    dismantling: "Dismantling",
  };
  return typeLabels[type as keyof typeof typeLabels] || type;
} 