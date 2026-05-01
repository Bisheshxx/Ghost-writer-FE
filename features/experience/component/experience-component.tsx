"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { IExperience } from "../types/experience-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import ExperienceForm from "../form/experience.form";
import CustomDialog from "@/shared/component/dialog/CustomDialog";
import { DIALOG_ENUMS } from "@/shared/constants";
import useUiState from "@/store/useUIStore";

export default function ExperienceComponent() {
  const experience = [
    {
      _id: "69e1bff248d57ef84f7a3d3b",
      user: "69e18eeb510a6b300eebc06e",
      companyName: "Acme Corp",
      jobTitle: "Backend Engineer",
      Descriptions:
        "Built and maintained REST APIs with Node.js and MongoDB.\nImplemented scalable microservices architecture.\nManaged database optimization and query performance.",
      startDate: "2023-01-15T00:00:00.000Z",
      isCurrent: true,
      endDate: null,
      relavantDetails:
        "Worked on authentication, rate limiting, and Docker setup.\nLed team of 3 engineers on core backend features.\nReduced API response time by 40%.",
      __v: 0,
      createdAt: "2026-04-17T05:06:58.752Z",
      updatedAt: "2026-04-17T05:06:58.752Z",
    },
    {
      _id: "69e1bff248d57ef84f7a3d3c",
      user: "69e18eeb510a6b300eebc06e",
      companyName: "Tech Innovations Ltd",
      jobTitle: "Full Stack Developer",
      Descriptions:
        "Developed full-stack web applications using React and Node.js.\nDesigned and implemented responsive UI components.\nCollaborated with product team to deliver features on schedule.",
      startDate: "2021-06-01T00:00:00.000Z",
      isCurrent: false,
      endDate: "2022-12-31T00:00:00.000Z",
      relavantDetails:
        "Tech stack: React, TypeScript, Express, PostgreSQL.\nImplemented real-time notifications using WebSockets.\nMentored 2 junior developers.",
      __v: 0,
      createdAt: "2026-04-17T05:06:58.752Z",
      updatedAt: "2026-04-17T05:06:58.752Z",
    },
    {
      _id: "69e1bff248d57ef84f7a3d3d",
      user: "69e18eeb510a6b300eebc06e",
      companyName: "StartupXYZ",
      jobTitle: "Junior Frontend Developer",
      Descriptions:
        "Built and maintained company website using Next.js.\nFixed bugs and improved performance across UI components.\nParticipated in daily standups and sprint planning.",
      startDate: "2020-03-15T00:00:00.000Z",
      isCurrent: false,
      endDate: "2021-05-30T00:00:00.000Z",
      relavantDetails:
        "Tech stack: Next.js, Tailwind CSS, Zustand, Storybook.\nImplemented pixel-perfect designs from Figma.\nConducted accessibility audits and fixed WCAG violations.",
      __v: 0,
      createdAt: "2026-04-17T05:06:58.752Z",
      updatedAt: "2026-04-17T05:06:58.752Z",
    },
  ];

  const { setOpenDialogName } = useUiState();

  const handleAddClick = () => {
    setOpenDialogName(DIALOG_ENUMS.CREATE_EXPERIENCE);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Experience</h2>
        <Button onClick={handleAddClick} className="text-sm">
          Add Experience
        </Button>
      </div>
      <div className="overflow-auto flex flex-col gap-6">
        {experience.map((exp) => (
          <ExperienceCardComponent experience={exp} key={exp._id} />
        ))}
      </div>

      <ExperienceAddDialog />

      <ExperienceEditDialog />

      <ExperienceDeleteDialog />
    </>
  );
}

function ExperienceAddDialog() {
  const { setOpenDialogName } = useUiState();

  const emptyExperience: IExperience = {
    _id: "",
    user: "",
    companyName: "",
    jobTitle: "",
    Descriptions: "",
    startDate: new Date().toISOString().split("T")[0],
    isCurrent: false,
    endDate: null,
    relavantDetails: "",
    __v: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const handleSave = (data: Partial<IExperience>) => {
    console.log("Creating new experience:", data);
    setOpenDialogName(null);
  };

  const handleCancel = () => {
    setOpenDialogName(null);
  };

  return (
    <CustomDialog
      width="md:max-w-5xl"
      title={"Add Experience"}
      description="Add a new experience to your profile"
      dialogName={DIALOG_ENUMS.CREATE_EXPERIENCE}
    >
      <ExperienceForm
        experience={emptyExperience}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </CustomDialog>
  );
}

function ExperienceEditDialog() {
  const { selectedExperience, setOpenDialogName } = useUiState();

  if (!selectedExperience) return null;

  const handleSave = (data: Partial<IExperience>) => {
    console.log("Saving:", data);
    setOpenDialogName(null);
  };

  const handleCancel = () => {
    setOpenDialogName(null);
  };

  return (
    <CustomDialog
      width="md:max-w-5xl"
      title={"Edit Experience"}
      description="Update your experience details below"
      dialogName={DIALOG_ENUMS.EDIT_EXPERIENCE}
    >
      <ExperienceForm
        experience={selectedExperience}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    </CustomDialog>
  );
}

function ExperienceDeleteDialog() {
  const { selectedExperience, setOpenDialogName } = useUiState();

  if (!selectedExperience) return null;

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
      title={"Delete Experience?"}
      description={`Are you sure you want to delete "${selectedExperience.jobTitle}" at "${selectedExperience.companyName}"? This action cannot be undone.`}
      dialogName={DIALOG_ENUMS.DELETE_EXPERIENCE}
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

const ExperienceCardComponent = ({
  experience,
}: {
  experience: IExperience;
}) => {
  const { setOpenDialogName, setSelectedExperience } = useUiState();
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };
  const handleEditClick = () => {
    setSelectedExperience(experience);
    setOpenDialogName(DIALOG_ENUMS.EDIT_EXPERIENCE);
  };

  const handleDeleteClick = () => {
    setSelectedExperience(experience);
    setOpenDialogName(DIALOG_ENUMS.DELETE_EXPERIENCE);
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
                    {experience.jobTitle}
                  </CardTitle>
                  {experience.isCurrent && (
                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 flex-shrink-0 mt-0.5"></div>
                  )}
                </div>
                <p className="text-gray-600 text-xs md:text-sm font-medium mt-0.5 sm:mt-1 truncate">
                  {experience.companyName}
                </p>
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
                {formatDate(experience.startDate)} -{" "}
                {experience.endDate
                  ? formatDate(experience.endDate)
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
              {experience.Descriptions}
            </p>
          </div>

          {experience.relavantDetails && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-tight sm:tracking-wide mb-1.5 sm:mb-2">
                Relevant Details
              </p>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed whitespace-pre-line line-clamp-3 sm:line-clamp-none">
                {experience.relavantDetails}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
