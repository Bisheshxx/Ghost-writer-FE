"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ExperienceFormData, IExperience } from "../types/experience-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import { experienceSchema } from "../schema/experience.schema";

interface ExperienceFormProps {
  experience?: IExperience;
  onSave: (data: Partial<IExperience>) => void;
  onCancel: () => void;
}

export default function ExperienceForm({
  experience,
  onSave,
  onCancel,
}: ExperienceFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      jobTitle: experience?.jobTitle || "",
      companyName: experience?.companyName || "",
      startDate: experience?.startDate.slice(0, 7) || "",
      endDate: experience?.endDate ? experience?.endDate.slice(0, 7) : "",
      Descriptions: experience?.Descriptions || "",
      relavantDetails: experience?.relavantDetails || "",
      isCurrent: experience?.isCurrent ?? false,
    },
  });

  const isCurrent = watch("isCurrent");
  const today = new Date();
  const maxMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}`;

  const onSubmit = (data: ExperienceFormData) => {
    onSave(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Job Title & Company Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="jobTitle" className="text-sm font-medium">
            Job Title *
          </Label>
          <Input
            id="jobTitle"
            placeholder="e.g. Senior Frontend Developer"
            {...register("jobTitle")}
            className="text-sm"
          />
          {errors.jobTitle && (
            <p className="text-xs text-red-500">{errors.jobTitle.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-sm font-medium">
            Company Name *
          </Label>
          <Input
            id="companyName"
            placeholder="e.g. Acme Corp"
            {...register("companyName")}
            className="text-sm"
          />
          {errors.companyName && (
            <p className="text-xs text-red-500">{errors.companyName.message}</p>
          )}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate" className="text-sm font-medium">
            Start Date *
          </Label>
          <Input
            id="startDate"
            type="month"
            max={maxMonth}
            {...register("startDate")}
            className="text-sm"
          />
          {errors.startDate && (
            <p className="text-xs text-red-500">{errors.startDate.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="endDate" className="text-sm font-medium">
            End Date
          </Label>
          <Input
            id="endDate"
            type="month"
            max={maxMonth}
            disabled={isCurrent}
            {...register("endDate")}
            className="text-sm disabled:opacity-50"
          />
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              {...register("isCurrent")}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Currently working</span>
          </label>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="Descriptions" className="text-sm font-medium">
          Description *
        </Label>
        <Textarea
          id="Descriptions"
          placeholder="Describe your role, responsibilities, and achievements..."
          {...register("Descriptions")}
          className="text-sm min-h-24 resize-none"
        />
        {errors.Descriptions && (
          <p className="text-xs text-red-500">{errors.Descriptions.message}</p>
        )}
      </div>

      {/* Relevant Details */}
      <div className="space-y-2">
        <Label htmlFor="relavantDetails" className="text-sm font-medium">
          Relevant Details
        </Label>
        <Textarea
          id="relavantDetails"
          placeholder="Any additional details, skills, or technologies used..."
          {...register("relavantDetails")}
          className="text-sm min-h-20 resize-none"
        />
      </div>

      {/* Footer Actions */}
      <DialogFooter className="gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="text-sm"
        >
          Cancel
        </Button>
        <Button type="submit" className="text-sm">
          Save Changes
        </Button>
      </DialogFooter>
    </form>
  );
}
