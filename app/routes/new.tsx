import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";

// Zod schema for form validation
const applicationFormSchema = z.object({
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
    plannedCommissioningDate: z.date().optional(),
    actualCommissioningDate: z.date().optional(),
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

  signatureDate: z.date().optional(),
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>;

export default function NewApplication() {
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
    },
  });

  const operatorSameAsSubscriber = form.watch("operatorSameAsSubscriber");

  function onSubmit(values: ApplicationFormValues) {
    console.log("Form submitted:", values);
    // Here you would typically send the data to your API
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">New Application</h1>
        <p className="text-muted-foreground">
          Create a new system application for energy infrastructure.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Application Type */}
          <Card>
            <CardHeader>
              <CardTitle>Application Type</CardTitle>
              <CardDescription>
                Select the type of system application you're submitting.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="systemType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>System Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select system type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="new_construction">
                          New Construction
                        </SelectItem>
                        <SelectItem value="extension">Extension</SelectItem>
                        <SelectItem value="dismantling">Dismantling</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="place"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Place (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter place/location details"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Plant Information */}
          <Card>
            <CardHeader>
              <CardTitle>Plant Information</CardTitle>
              <CardDescription>
                Details about the plant location and specifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plant Address */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Plant Address</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="plant.address.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street</FormLabel>
                        <FormControl>
                          <Input placeholder="Street name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="plant.address.houseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>House Number</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="plant.address.postcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postcode</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="plant.address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Separator />

              {/* Plant Contact Person (Optional) */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  Plant Contact Person (Optional)
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="plant.contactPerson.firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="First name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="plant.contactPerson.lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="plant.contactPerson.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+49 123 456789" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="plant.contactPerson.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="contact@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscriber (Connection/Property Owner) */}
          <Card>
            <CardHeader>
              <CardTitle>Connection/Property Owner</CardTitle>
              <CardDescription>
                Information about the property owner or connection subscriber.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="subscriber.firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subscriber.lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subscriber.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+49 123 456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="subscriber.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="owner@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Subscriber Address */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Address</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="subscriber.address.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street</FormLabel>
                        <FormControl>
                          <Input placeholder="Street name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subscriber.address.houseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>House Number</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subscriber.address.postcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postcode</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="subscriber.address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plant Operator */}
          <Card>
            <CardHeader>
              <CardTitle>Plant Operator</CardTitle>
              <CardDescription>
                Information about the plant operator. Can be the same as the
                property owner.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="operatorSameAsSubscriber"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Plant operator is the same as property owner
                      </FormLabel>
                      <FormDescription>
                        Check this if the plant operator and property owner are
                        the same person.
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {!operatorSameAsSubscriber && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="operator.firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="operator.lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="operator.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+49 123 456789" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="operator.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="operator@example.com"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  {/* Operator Address */}
                  <div className="space-y-4">
                    <Label className="text-base font-semibold">Address</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="operator.address.street"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street</FormLabel>
                            <FormControl>
                              <Input placeholder="Street name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="operator.address.houseNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>House Number</FormLabel>
                            <FormControl>
                              <Input placeholder="123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="operator.address.postcode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Postcode</FormLabel>
                            <FormControl>
                              <Input placeholder="12345" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="operator.address.city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="City name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Installer Company */}
          <Card>
            <CardHeader>
              <CardTitle>Installer Company</CardTitle>
              <CardDescription>
                Information about the company installing the system.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="installer.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Company name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="installer.registrationNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Registration Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Company registration number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="installer.phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+49 123 456789" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="installer.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="company@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Separator />

              {/* Installer Address */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Company Address</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="installer.address.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street</FormLabel>
                        <FormControl>
                          <Input placeholder="Street name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="installer.address.houseNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>House Number</FormLabel>
                        <FormControl>
                          <Input placeholder="123" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="installer.address.postcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postcode</FormLabel>
                        <FormControl>
                          <Input placeholder="12345" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="installer.address.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input placeholder="City name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
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
