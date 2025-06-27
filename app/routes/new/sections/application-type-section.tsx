import type { Control } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import type { ApplicationFormValues } from "../schema";

interface ApplicationTypeSectionProps {
  control: Control<ApplicationFormValues>;
}

export function ApplicationTypeSection({ control }: ApplicationTypeSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Type</CardTitle>
        <CardDescription>
          Select the type of system application you're submitting.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={control}
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
          control={control}
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
  );
} 