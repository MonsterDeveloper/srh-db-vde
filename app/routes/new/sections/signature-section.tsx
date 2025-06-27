import type { Control } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import type { ApplicationFormValues } from "../schema";

interface SignatureSectionProps {
  control: Control<ApplicationFormValues>;
}

export function SignatureSection({ control }: SignatureSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Signature</CardTitle>
        <CardDescription>
          Optional signature date for the application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <FormField
          control={control}
          name="signatureDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Signature Date</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                  }}
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