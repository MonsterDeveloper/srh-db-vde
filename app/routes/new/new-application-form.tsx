import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useSubmit, useActionData } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import { Form } from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { applicationFormSchema, type ApplicationFormValues } from "./schema";
import { ApplicationTypeSection } from "./sections/application-type-section";
import { PlantInformationSection } from "~/routes/new/sections/plant-information-section";
import { SubscriberSection } from "~/routes/new/sections/subscriber-section";
import { OperatorSection } from "~/routes/new/sections/operator-section";
import { InstallerSection } from "~/routes/new/sections/installer-section";
import { SignatureSection } from "~/routes/new/sections/signature-section";
import type { action } from "../new";

export function NewApplicationForm() {
  const actionData = useActionData<typeof action>();
  const form = useForm({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      systemType: undefined,
      place: "",
      plant: {
        address: {
          street: "",
          houseNumber: "",
          postcode: "",
          city: "",
          country: "Germany",
        },
        contactPerson: {
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
        },
        plannedCommissioningDate: "",
        actualCommissioningDate: "",
      },
      subscriber: {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: {
          street: "",
          houseNumber: "",
          postcode: "",
          city: "",
          country: "Germany",
        },
      },
      operatorSameAsSubscriber: false,
      operator: {
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: {
          street: "",
          houseNumber: "",
          postcode: "",
          city: "",
          country: "Germany",
        },
      },
      installer: {
        name: "",
        registrationNumber: "",
        phone: "",
        email: "",
        address: {
          street: "",
          houseNumber: "",
          postcode: "",
          city: "",
          country: "Germany",
        },
      },
      signatureDate: "",
    },
  });

  const submit = useSubmit();
  const operatorSameAsSubscriber = form.watch("operatorSameAsSubscriber");

  function onSubmit(values: ApplicationFormValues) {
    submit(
      values,
      { method: "POST", encType: "application/json" }
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">New Application</h1>
        <p className="text-muted-foreground">
          Create a new system application for energy infrastructure.
        </p>
      </div>

      {actionData?.error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">{actionData.error}</p>
          </CardContent>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <ApplicationTypeSection control={form.control} />
          <PlantInformationSection control={form.control} />
          <SubscriberSection control={form.control} />
          <OperatorSection 
            control={form.control} 
            operatorSameAsSubscriber={operatorSameAsSubscriber} 
          />
          <InstallerSection control={form.control} />
          <SignatureSection control={form.control} />

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline">
              Save Draft
            </Button>
            <Button type="submit">Submit Application</Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 