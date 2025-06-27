import type { Route } from "./+types/new";
import { NewApplicationForm } from "~/routes/new/new-application-form";
import { redirect } from "react-router";
import { addresses, persons, companies, plants, applications } from "~/database/schema";
import { applicationFormSchema } from "~/routes/new/schema";

export async function action({ request, context }: Route.ActionArgs) {
  try {
    const validatedData = applicationFormSchema.parse(await request.json());
    
    const [plantAddress] = await context.database.insert(addresses).values({
      street: validatedData.plant.address.street,
      houseNumber: validatedData.plant.address.houseNumber,
      postcode: validatedData.plant.address.postcode,
      city: validatedData.plant.address.city,
      country: validatedData.plant.address.country,
    }).returning();

    const [subscriberAddress] = await context.database.insert(addresses).values({
      street: validatedData.subscriber.address.street,
      houseNumber: validatedData.subscriber.address.houseNumber,
      postcode: validatedData.subscriber.address.postcode,
      city: validatedData.subscriber.address.city,
      country: validatedData.subscriber.address.country,
    }).returning();

    const [subscriber] = await context.database.insert(persons).values({
      firstName: validatedData.subscriber.firstName,
      lastName: validatedData.subscriber.lastName,
      phone: validatedData.subscriber.phone || null,
      email: validatedData.subscriber.email || null,
      addressId: subscriberAddress.id,
    }).returning();

    let operatorId = subscriber.id;
    if (!validatedData.operatorSameAsSubscriber && validatedData.operator) {
      const operatorAddressData = validatedData.operator.address;
      if (operatorAddressData?.street && operatorAddressData?.houseNumber && 
          operatorAddressData?.postcode && operatorAddressData?.city) {
        const [operatorAddress] = await context.database.insert(addresses).values({
          street: operatorAddressData.street,
          houseNumber: operatorAddressData.houseNumber,
          postcode: operatorAddressData.postcode,
          city: operatorAddressData.city,
          country: operatorAddressData.country || "Germany",
        }).returning();

        const [operator] = await context.database.insert(persons).values({
          firstName: validatedData.operator.firstName || "",
          lastName: validatedData.operator.lastName || "",
          phone: validatedData.operator.phone || null,
          email: validatedData.operator.email || null,
          addressId: operatorAddress.id,
        }).returning();

        operatorId = operator.id;
      }
    }

    const [installerAddress] = await context.database.insert(addresses).values({
      street: validatedData.installer.address.street,
      houseNumber: validatedData.installer.address.houseNumber,
      postcode: validatedData.installer.address.postcode,
      city: validatedData.installer.address.city,
      country: validatedData.installer.address.country,
    }).returning();

    const [installer] = await context.database.insert(companies).values({
      name: validatedData.installer.name,
      registrationNumber: validatedData.installer.registrationNumber || null,
      phone: validatedData.installer.phone || null,
      email: validatedData.installer.email || null,
      addressId: installerAddress.id,
    }).returning();

    let contactPersonId = null;
    if (validatedData.plant.contactPerson?.firstName && validatedData.plant.contactPerson?.lastName) {
      const [contactPerson] = await context.database.insert(persons).values({
        firstName: validatedData.plant.contactPerson.firstName,
        lastName: validatedData.plant.contactPerson.lastName,
        phone: validatedData.plant.contactPerson.phone || null,
        email: validatedData.plant.contactPerson.email || null,
        addressId: plantAddress.id,
      }).returning();
      contactPersonId = contactPerson.id;
    }

    const [plant] = await context.database.insert(plants).values({
      addressId: plantAddress.id,
      contactPersonId,
      plannedCommissioningDate: validatedData.plant.plannedCommissioningDate ? new Date(validatedData.plant.plannedCommissioningDate) : null,
      actualCommissioningDate: validatedData.plant.actualCommissioningDate ? new Date(validatedData.plant.actualCommissioningDate) : null,
    }).returning();

    await context.database.insert(applications).values({
      systemType: validatedData.systemType,
      plantId: plant.id,
      subscriberId: subscriber.id,
      operatorId: validatedData.operatorSameAsSubscriber ? subscriber.id : operatorId,
      installerId: installer.id,
      place: validatedData.place || null,
      signatureDate: validatedData.signatureDate ? new Date(validatedData.signatureDate) : null,
      status: "pending",
    });

    return redirect("/");
  } catch (error) {
    console.error("Error creating application:", error);
    return { error: "Failed to create application. Please try again." };
  }
} 

export default function NewApplication() {
  return <NewApplicationForm />;
}
