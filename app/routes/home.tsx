import { useLoaderData } from "react-router";
import { eq } from "drizzle-orm";
import { applications, persons, companies, plants, addresses } from "~/database/schema";
import type { Route } from "./+types/home";
import { SectionCards } from "~/routes/home/section-cards";
import { DataTable } from "~/routes/home/data-table";

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

// Action function to handle delete requests
export async function action({ request, context }: Route.ActionArgs) {
  const { database } = context;
  
  if (request.method === "DELETE") {
    const formData = await request.formData();
    const applicationId = formData.get("id") as string;
    
    if (!applicationId) {
      throw new Error("Application ID is required");
    }
    
    // Delete the application from the database
    await database
      .delete(applications)
      .where(eq(applications.id, parseInt(applicationId)));
    
    return { success: true };
  }
  
  throw new Error("Method not allowed");
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
