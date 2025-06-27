import { TrendingUp, TrendingDown, FileText, Clock, CheckCircle, Users } from "lucide-react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
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

import type { Route } from "./+types/home";

export function meta() {
  return [
    { title: "SRH DB VDE - Dashboard" },
  ];
}

// Sample data based on the schema
const sampleApplications = [
  {
    id: "app-001",
    systemType: "new_construction" as const,
    status: "approved" as const,
    submissionDate: new Date("2024-01-15"),
    place: "Munich",
    subscriber: "Max Mustermann",
    installer: "Solar Tech GmbH",
  },
  {
    id: "app-002",
    systemType: "extension" as const,
    status: "pending" as const,
    submissionDate: new Date("2024-01-20"),
    place: "Berlin",
    subscriber: "Anna Schmidt",
    installer: "Green Energy Solutions",
  },
  {
    id: "app-003",
    systemType: "dismantling" as const,
    status: "under_review" as const,
    submissionDate: new Date("2024-01-18"),
    place: "Hamburg",
    subscriber: "Thomas Weber",
    installer: "Eco Systems Ltd",
  },
  {
    id: "app-004",
    systemType: "new_construction" as const,
    status: "approved" as const,
    submissionDate: new Date("2024-01-10"),
    place: "Frankfurt",
    subscriber: "Lisa Mueller",
    installer: "Solar Tech GmbH",
  },
  {
    id: "app-005",
    systemType: "extension" as const,
    status: "rejected" as const,
    submissionDate: new Date("2024-01-12"),
    place: "Dresden",
    subscriber: "Michael Brown",
    installer: "Power Solutions Inc",
  },
  {
    id: "app-006",
    systemType: "new_construction" as const,
    status: "completed" as const,
    submissionDate: new Date("2024-01-05"),
    place: "Cologne",
    subscriber: "Sarah Johnson",
    installer: "Green Energy Solutions",
  },
];

function SectionCards() {
  const totalApplications = sampleApplications.length;
  const pendingReviews = sampleApplications.filter(app => 
    app.status === "pending" || app.status === "under_review"
  ).length;
  const approvedThisMonth = sampleApplications.filter(app => 
    app.status === "approved" && app.submissionDate.getMonth() === new Date().getMonth()
  ).length;
  const completedApplications = sampleApplications.filter(app => 
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

export default function Home() {
  return (
    <div className="flex-1 space-y-6 p-4 lg:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <SectionCards />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">VDE Applications</h2>
        </div>
        
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>System Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submission Date</TableHead>
                  <TableHead>Subscriber</TableHead>
                  <TableHead>Place</TableHead>
                  <TableHead>Installer</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sampleApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">
                      {application.id}
                    </TableCell>
                    <TableCell>
                      {getSystemTypeLabel(application.systemType)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(application.status)}
                    </TableCell>
                    <TableCell>
                      {application.submissionDate.toLocaleDateString()}
                    </TableCell>
                    <TableCell>{application.subscriber}</TableCell>
                    <TableCell>{application.place}</TableCell>
                    <TableCell>{application.installer}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
