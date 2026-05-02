"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DialogFooter } from "@/components/ui/dialog";
import {
  qualificationSchema,
  QualificationFormData,
} from "../schema/qualification.schema";
import { IQualification } from "../types/qualification.d";

interface QualificationFormProps {
  qualification?: IQualification;
  onSave: (data: Partial<IQualification>) => void;
  onCancel: () => void;
}

export default function QualificationForm({
  qualification,
  onSave,
  onCancel,
}: QualificationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<QualificationFormData>({
    resolver: zodResolver(qualificationSchema),
    defaultValues: {
      instituteName: qualification?.instituteName || "",
      descriptions: qualification?.descriptions || "",
      startDate: qualification?.startDate.slice(0, 7) || "",
      endDate: qualification?.endDate ? qualification?.endDate.slice(0, 7) : "",
      isCurrent: qualification?.isCurrent ?? false,
      relavantDetails: qualification?.relavantDetails || "",
    },
  });

  const isCurrent = watch("isCurrent");
  const today = new Date();
  const maxMonth = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}`;

  const onSubmit = (data: QualificationFormData) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="instituteName" className="text-xs sm:text-sm">
          Institute Name *
        </Label>
        <Input
          id="instituteName"
          placeholder="e.g., University of Technology"
          {...register("instituteName")}
          className="text-xs sm:text-sm mt-1"
        />
        {errors.instituteName && (
          <p className="text-red-500 text-xs mt-1">
            {errors.instituteName.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="descriptions" className="text-xs sm:text-sm">
          Description *
        </Label>
        <Textarea
          id="descriptions"
          placeholder="e.g., Bachelor of Science in Computer Science"
          rows={4}
          {...register("descriptions")}
          className="text-xs sm:text-sm mt-1"
        />
        {errors.descriptions && (
          <p className="text-red-500 text-xs mt-1">
            {errors.descriptions.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate" className="text-xs sm:text-sm">
            Start Date *
          </Label>
          <Input
            id="startDate"
            type="month"
            max={maxMonth}
            {...register("startDate")}
            className="text-xs sm:text-sm mt-1"
          />
          {errors.startDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.startDate.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="endDate" className="text-xs sm:text-sm">
            End Date
          </Label>
          <Input
            id="endDate"
            type="month"
            max={maxMonth}
            disabled={isCurrent}
            {...register("endDate")}
            className="text-xs sm:text-sm mt-1"
          />
          {errors.endDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.endDate.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isCurrent"
          type="checkbox"
          {...register("isCurrent")}
          className="h-4 w-4"
        />
        <Label htmlFor="isCurrent" className="text-xs sm:text-sm font-normal">
          Currently Studying
        </Label>
      </div>

      <div>
        <Label htmlFor="relavantDetails" className="text-xs sm:text-sm">
          Relevant Details
        </Label>
        <Textarea
          id="relavantDetails"
          placeholder="e.g., Activities, accomplishments, or any other relevant information"
          rows={3}
          {...register("relavantDetails")}
          className="text-xs sm:text-sm mt-1"
        />
        {errors.relavantDetails && (
          <p className="text-red-500 text-xs mt-1">
            {errors.relavantDetails.message}
          </p>
        )}
      </div>

      <DialogFooter className="gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="text-xs sm:text-sm"
        >
          Cancel
        </Button>
        <Button type="submit" className="text-xs sm:text-sm">
          {qualification ? "Update" : "Create"}
        </Button>
      </DialogFooter>
    </form>
  );
}
