import { type InferSelectModel, type InferInsertModel } from "drizzle-orm";
import { applications, persons, companies, plants, addresses } from "../../../database/schema";

// Infer types from Drizzle schema
export type Application = InferSelectModel<typeof applications>;
export type NewApplication = InferInsertModel<typeof applications>;

// Additional inferred types for related entities
export type Person = InferSelectModel<typeof persons>;
export type NewPerson = InferInsertModel<typeof persons>;

export type Company = InferSelectModel<typeof companies>;
export type NewCompany = InferInsertModel<typeof companies>;

export type Plant = InferSelectModel<typeof plants>;
export type NewPlant = InferInsertModel<typeof plants>;

export type Address = InferSelectModel<typeof addresses>;
export type NewAddress = InferInsertModel<typeof addresses>;

// Extended types with relations (for when you need populated data)
export type ApplicationWithRelations = Application & {
  plant?: Plant & {
    address?: Address;
    contactPerson?: Person;
  };
  subscriber?: Person & {
    address?: Address;
  };
  operator?: Person & {
    address?: Address;
  };
  installer?: Company & {
    address?: Address;
  };
}; 