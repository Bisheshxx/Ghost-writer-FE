import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { CoverletterFormData } from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import { coverLetterSchema } from "../schema/coverletter.schema";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import LoadingButtonComponent from "@/shared/component/button/LoadingButtonComponent";
import { useGenerateCoverLetter } from "../application/useGenerateCoverLetter";
import { useCoverLetterStore } from "../store/useCoverLetterStore";

export default function CoverLetterComponent() {
  return (
    <div>
      <CoverLetterForm />
    </div>
  );
}

function CoverLetterForm() {
  const { setCoverLetter, setIsCoverLetterLoading, setIsCoverLetterError } =
    useCoverLetterStore();

  const { control, handleSubmit, formState } = useForm<CoverletterFormData>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: {
      jobDescription: "",
    },
  });
  const generateCoverLetter = useGenerateCoverLetter({
    onSuccess: (data) => {
      setIsCoverLetterLoading(false);
      setIsCoverLetterError(false);
      setCoverLetter(data?.data as string);
    },
    onError: () => {
      setIsCoverLetterLoading(false);
      setIsCoverLetterError(true);
    },
  });
  const onSubmit = async (data: CoverletterFormData) => {
    setIsCoverLetterLoading(true);
    await generateCoverLetter.mutateAsync(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="jobDescription"
        render={({ field, fieldState }) => (
          <Field
            data-invalid={fieldState.invalid || undefined}
            className="relative"
          >
            <FieldLabel
              className="flex justify-between items-center"
              htmlFor="projectTitle"
            >
              Job Description *
              <LoadingButtonComponent
                isLoading={formState.isSubmitting}
                text="Generate"
                className="absolute right-0 bottom-0"
              />
            </FieldLabel>
            <Textarea
              {...field}
              id="jobDescription"
              placeholder="Add the job Description here..."
              aria-invalid={fieldState.invalid || undefined}
              className="text-sm focus-visible:ring-0 focus-visible:border-muted h-[200px] "
              rows={6}
            />
            <FieldError errors={[fieldState.error]} />
          </Field>
        )}
      />
    </form>
  );
}
