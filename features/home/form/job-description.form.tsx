import { Controller, useForm } from "react-hook-form";
import { SchemaJobDescriptionType } from "../types/home.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { SchemaJobDescription } from "../schema/job-description.schema";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import LoadingButtonComponent from "@/shared/component/button/LoadingButtonComponent";
import useJobStore from "@/store/useJobStore";

export default function JobDescriptionForm() {
  const { setJobDescription } = useJobStore();
  const form = useForm<SchemaJobDescriptionType>({
    resolver: zodResolver(SchemaJobDescription),
    defaultValues: {
      jobDescription: "",
    },
  });

  const handleCreate = async (data: SchemaJobDescriptionType) => {
    const { jobDescription } = data;
    setJobDescription(jobDescription);
  };

  return (
    <form
      id="form-job-description"
      onSubmit={form.handleSubmit(handleCreate)}
      className="flex-col flex gap-2"
    >
      <div className="flex gap-1">
        <Controller
          name={`jobDescription`}
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="form-job-description">
                Job Description
              </FieldLabel>
              <Textarea
                {...field}
                className="bg-background h-96"
                id={`jobDescription`}
                aria-invalid={fieldState.invalid || undefined}
                rows={10}
              />
              <FieldError errors={[fieldState.error]} />
            </Field>
          )}
        />
      </div>
      <LoadingButtonComponent
        isLoading={form.formState.isSubmitting}
        text="Next"
        className="mt-2"
      />
    </form>
  );
}
