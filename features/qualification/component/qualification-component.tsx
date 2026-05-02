"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IQualification } from "../types/qualification.d";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DialogFooter } from "@/components/ui/dialog";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import QualificationForm from "../form/qualification.form";
import CustomDialog from "@/shared/component/dialog/CustomDialog";
import { DIALOG_ENUMS } from "@/shared/constants";
import useUiState from "@/store/useUIStore";

export default function QualificationComponent() {
  const qualifications: IQualification[] = [
    {
      _id: "69e1bff248d57ef84f7a3d3e",
      user: "69e18eeb510a6b300eebc06e",
      instituteName: "University of Technology",
      descriptions:
        "Bachelor of Science in Computer Science\nGPA: 3.8/4.0\nHonors: Cum Laude",
      startDate: "2018-09-01T00:00:00.000Z",
      isCurrent: false,
      endDate: "2022-05-30T00:00:00.000Z",
      relavantDetails:
        "Relevant Coursework: Data Structures, Algorithms, Web Development, Database Management\nScholarship: Merit-based full tuition scholarship\nActivities: President of Computer Science Club, Hackathon Winner 2021",
      __v: 0,
      createdAt: "2026-04-17T05:06:58.752Z",
      updatedAt: "2026-04-17T05:06:58.752Z",
    },
    {
      _id: "69e1bff248d57ef84f7a3d3f",
      user: "69e18eeb510a6b300eebc06e",
      instituteName: "Advanced Technical Institute",
      descriptions:
        "Diploma in Full Stack Web Development\nSpecialization: JavaScript and Modern Frameworks",
      startDate: "2022-07-15T00:00:00.000Z",
      isCurrent: true,
      endDate: null,
      relavantDetails:
        "Completed projects: E-commerce platform, Real-time Chat Application, Task Management System\nCertifications: AWS Solutions Architect Associate (In Progress)",
      __v: 0,
      createdAt: "2026-04-17T05:06:58.752Z",
      updatedAt: "2026-04-17T05:06:58.752Z",
    },
    {
      _id: "69e1bff248d57ef84f7a3d40",
      user: "69e18eeb510a6b300eebc06e",
      instituteName: "Professional Development Center",
      descriptions: "Google Cloud Professional Data Engineer Certification",
      startDate: "2023-01-10T00:00:00.000Z",
      isCurrent: false,
      endDate: "2023-06-20T00:00:00.000Z",
      relavantDetails:
        "Topics covered: BigQuery, Dataflow, Pub/Sub, Machine Learning\nPassed exam with 89% score",
      __v: 0,
      createdAt: "2026-04-17T05:06:58.752Z",
      updatedAt: "2026-04-17T05:06:58.752Z",
    },
  ];

  const { setOpenDialogName } = useUiState();

  const handleAddClick = () => {
    setOpenDialogName(DIALOG_ENUMS.CREATE_QUALIFICATION);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Qualification</h2>
        <Button onClick={handleAddClick} className="text-sm">
          Add Qualification
        </Button>
      </div>
      <div className="overflow-auto flex flex-col gap-6">
        {qualifications.map((qualification) => (
          <QualificationCardComponent
            qualification={qualification}
            key={qualification._id}
          />
        ))}
      </div>

      <QualificationAddDialog />

      <QualificationEditDialog />

      <QualificationDeleteDialog />
    </>
  );
}

function QualificationAddDialog() {
  const { setOpenDialogName } = useUiState();

  const handleSave = (data: Partial<IQualification>) => {
    console.log("Creating new qualification:", data);
    setOpenDialogName(null);
  };

  const handleCancel = () => {
    setOpenDialogName(null);
  };

  return (
    <CustomDialog
      width="md:max-w-5xl"
      title={"Add Qualification"}
      description="Add a new qualification to your profile"
      dialogName={DIALOG_ENUMS.CREATE_QUALIFICATION}
    >
      <QualificationForm onSave={handleSave} onCancel={handleCancel} />
    </CustomDialog>
  );
}

function QualificationEditDialog() {
  const { selectedQualification, setOpenDialogName } = useUiState();

  if (!selectedQualification) return null;

  const handleSave = (data: Partial<IQualification>) => {
    console.log("Saving:", data);
    setOpenDialogName(null);
  };

  const handleCancel = () => {
    setOpenDialogName(null);
  };

  return (
    <CustomDialog
      width="md:max-w-5xl"
      title={"Edit Qualification"}
      description="Update your qualification details below"
      dialogName={DIALOG_ENUMS.EDIT_QUALIFICATION}
    >
      <QualificationForm
        qualification={selectedQualification}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </CustomDialog>
  );
}

function QualificationDeleteDialog() {
  const { selectedQualification, setOpenDialogName } = useUiState();

  if (!selectedQualification) return null;

  const handleConfirm = () => {
    console.log("Deleted");
    setOpenDialogName(null);
  };

  const handleCancel = () => {
    setOpenDialogName(null);
  };

  return (
    <CustomDialog
      width="md:max-w-sm"
      title={"Delete Qualification?"}
      description={`Are you sure you want to delete "${selectedQualification.instituteName}"? This action cannot be undone.`}
      dialogName={DIALOG_ENUMS.DELETE_QUALIFICATION}
    >
      <DialogFooter className="gap-2">
        <Button variant="outline" onClick={handleCancel} className="text-sm">
          Cancel
        </Button>
        <Button
          variant="outline"
          className="text-sm text-red-600 border-red-300 hover:bg-red-50"
          onClick={handleConfirm}
        >
          Delete
        </Button>
      </DialogFooter>
    </CustomDialog>
  );
}

const QualificationCardComponent = ({
  qualification,
}: {
  qualification: IQualification;
}) => {
  const { setOpenDialogName, setSelectedQualification } = useUiState();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const handleEditClick = () => {
    setSelectedQualification(qualification);
    setOpenDialogName(DIALOG_ENUMS.EDIT_QUALIFICATION);
  };

  const handleDeleteClick = () => {
    setSelectedQualification(qualification);
    setOpenDialogName(DIALOG_ENUMS.DELETE_QUALIFICATION);
  };

  return (
    <>
      <Card className="w-full shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow">
        <CardHeader className="pb-2 md:pb-4 px-2.5 sm:px-4 md:px-6">
          <div className="flex flex-col gap-2.5 sm:gap-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  <CardTitle className="text-xs sm:text-sm md:text-lg lg:text-2xl font-semibold text-gray-900 break-words">
                    {qualification.instituteName}
                  </CardTitle>
                  {qualification.isCurrent && (
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 flex-shrink-0 mt-0.5"></div>
                  )}
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 sm:h-8 sm:w-8 p-0 flex-shrink-0"
                  >
                    <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="text-xs sm:text-sm">
                  <DropdownMenuItem onClick={handleEditClick}>
                    <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={handleDeleteClick}
                  >
                    <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="text-left text-xs sm:text-sm">
              <p className="text-gray-500 font-medium text-xs">Duration</p>
              <p className="font-semibold text-gray-900 text-xs sm:text-sm">
                {formatDate(qualification.startDate)} -{" "}
                {qualification.endDate
                  ? formatDate(qualification.endDate)
                  : "Present"}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2.5 sm:space-y-4 md:space-y-5 px-2.5 sm:px-4 md:px-6">
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-tight sm:tracking-wide mb-1.5 sm:mb-2">
              Description
            </p>
            <p className="text-gray-700 text-xs md:text-sm leading-relaxed whitespace-pre-line line-clamp-4 sm:line-clamp-none">
              {qualification.descriptions}
            </p>
          </div>

          {qualification.relavantDetails && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-tight sm:tracking-wide mb-1.5 sm:mb-2">
                Relevant Details
              </p>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed whitespace-pre-line line-clamp-3 sm:line-clamp-none">
                {qualification.relavantDetails}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
