import { integer, sqliteTable, text, index, uniqueIndex } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

export const addresses = sqliteTable("addresses", {
  id: integer().primaryKey({ autoIncrement: true }),
  street: text().notNull(),
  houseNumber: text("house_number").notNull(),
  postcode: text().notNull(),
  city: text().notNull(),
  country: text().notNull().default("Germany"),
  createdAt: integer("created_at", { mode: "timestamp" }).$default(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$default(() => new Date()),
}, (table) => [
  index("idx_addresses_location").on(table.street, table.houseNumber, table.postcode, table.city)
]);

export const persons = sqliteTable("persons", {
  id: integer().primaryKey({ autoIncrement: true }),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  phone: text(),
  email: text(),
  addressId: integer("address_id").notNull().references(() => addresses.id),
  createdAt: integer("created_at", { mode: "timestamp" }).$default(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$default(() => new Date()),
});

export const companies = sqliteTable("companies", {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  registrationNumber: text("registration_number"),
  addressId: integer("address_id").references(() => addresses.id),
  phone: text(),
  email: text(),
  createdAt: integer("created_at", { mode: "timestamp" }).$default(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$default(() => new Date()),
}, (table) => [
  uniqueIndex("idx_companies_registration_number").on(table.registrationNumber),
  index("idx_companies_name").on(table.name)
]);

export const plants = sqliteTable("plants", {
  id: integer().primaryKey({ autoIncrement: true }),
  addressId: integer("address_id").notNull().references(() => addresses.id),
  contactPersonId: integer("contact_person_id").references(() => persons.id),
  plannedCommissioningDate: integer("planned_commissioning_date", { mode: "timestamp" }),
  actualCommissioningDate: integer("actual_commissioning_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$default(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$default(() => new Date()),
});

export const applications = sqliteTable("applications", {
  id: integer().primaryKey({ autoIncrement: true }),
  // Using text with type constraint for enum-like behavior
  systemType: text("system_type", { 
    enum: ["new_construction", "extension", "dismantling"] 
  }).notNull(),
  plantId: integer("plant_id").notNull().references(() => plants.id),
  subscriberId: integer("subscriber_id").notNull().references(() => persons.id),
  operatorId: integer("operator_id").references(() => persons.id),
  installerId: integer("installer_id").references(() => companies.id),
  // Using text with type constraint for enum-like behavior
  status: text({ 
    enum: ["draft", "pending", "under_review", "approved", "rejected", "completed"] 
  }).notNull().default("pending"),
  submissionDate: integer("submission_date", { mode: "timestamp" }).notNull().$default(() => new Date()),
  place: text(),
  signatureDate: integer("signature_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$default(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$default(() => new Date()),
}, (table) => [
  index("idx_applications_status").on(table.status),
  index("idx_applications_submission_date").on(table.submissionDate)
]);

// Relations
export const addressesRelations = relations(addresses, ({ many }) => ({
  persons: many(persons),
  companies: many(companies),
  plants: many(plants),
}));

export const personsRelations = relations(persons, ({ one, many }) => ({
  address: one(addresses, {
    fields: [persons.addressId],
    references: [addresses.id],
  }),
  plantsAsContact: many(plants),
  applicationsAsSubscriber: many(applications, {
    relationName: "subscriber",
  }),
  applicationsAsOperator: many(applications, {
    relationName: "operator",
  }),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  address: one(addresses, {
    fields: [companies.addressId],
    references: [addresses.id],
  }),
  applications: many(applications),
}));

export const plantsRelations = relations(plants, ({ one, many }) => ({
  address: one(addresses, {
    fields: [plants.addressId],
    references: [addresses.id],
  }),
  contactPerson: one(persons, {
    fields: [plants.contactPersonId],
    references: [persons.id],
  }),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one }) => ({
  plant: one(plants, {
    fields: [applications.plantId],
    references: [plants.id],
  }),
  subscriber: one(persons, {
    fields: [applications.subscriberId],
    references: [persons.id],
    relationName: "subscriber",
  }),
  operator: one(persons, {
    fields: [applications.operatorId],
    references: [persons.id],
    relationName: "operator",
  }),
  installer: one(companies, {
    fields: [applications.installerId],
    references: [companies.id],
  }),
}));

