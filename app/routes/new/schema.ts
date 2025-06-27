import { z } from "zod";

// Zod schema for form validation
export const applicationFormSchema = z.object({
  // Application basics
  systemType: z.enum(["new_construction", "extension", "dismantling"], {
    required_error: "Please select a system type",
  }),
  place: z.string().optional(),
  
  // Plant information
  plant: z.object({
    address: z.object({
      street: z.string().min(1, "Street is required"),
      houseNumber: z.string().min(1, "House number is required"),
      postcode: z.string().min(1, "Postcode is required"),
      city: z.string().min(1, "City is required"),
      country: z.string().default("Germany"),
    }),
    contactPerson: z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      email: z.string().email().optional().or(z.literal("")),
    }).optional(),
    plannedCommissioningDate: z.string().optional(),
    actualCommissioningDate: z.string().optional(),
  }),

  // Subscriber (Connection/Property Owner)
  subscriber: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    address: z.object({
      street: z.string().min(1, "Street is required"),
      houseNumber: z.string().min(1, "House number is required"),
      postcode: z.string().min(1, "Postcode is required"),
      city: z.string().min(1, "City is required"),
      country: z.string().default("Germany"),
    }),
  }),

  // Operator (Plant Operator)  
  operatorSameAsSubscriber: z.boolean().default(false),
  operator: z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    address: z.object({
      street: z.string().optional(),
      houseNumber: z.string().optional(),
      postcode: z.string().optional(),
      city: z.string().optional(),
      country: z.string().default("Germany"),
    }).optional(),
  }).optional(),

  // Installer (Company)
  installer: z.object({
    name: z.string().min(1, "Company name is required"),
    registrationNumber: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
    address: z.object({
      street: z.string().min(1, "Street is required"),
      houseNumber: z.string().min(1, "House number is required"),
      postcode: z.string().min(1, "Postcode is required"),
      city: z.string().min(1, "City is required"),
      country: z.string().default("Germany"),
    }),
  }),

  signatureDate: z.string().optional(),
}).refine((data) => {
  if (!data.operatorSameAsSubscriber) {
    return data.operator?.firstName && 
           data.operator?.lastName && 
           data.operator?.address?.street &&
           data.operator?.address?.houseNumber &&
           data.operator?.address?.postcode &&
           data.operator?.address?.city;
  }
  return true;
}, {
  message: "Operator details are required when operator is different from subscriber",
  path: ["operator"]
});

export type ApplicationFormValues = z.infer<typeof applicationFormSchema>; 