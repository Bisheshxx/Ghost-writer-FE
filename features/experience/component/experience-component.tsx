"use client";

import { Button } from "@/components/ui/button";
import { ExperienceFormData, IExperience } from "../types/experience-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DialogFooter } from "@/components/ui/dialog";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import ExperienceForm from "../form/experience.form";
import CustomDialog from "@/shared/component/dialog/CustomDialog";
import { EXPERIENCE_DIALOGS } from "../constants";
import { useExperienceUiStore } from "../store/useExperienceUiStore";
import { useState } from "react";
import Loading from "@/app/loading";

import { showSuccess } from "@/lib/toast/toast.lib";
import NothingToDisplay from "@/shared/component/NothingToDisplay";
import {
  useCreateExperience,
  useDeleteExperience,
  useExperiences,
  useUpdateExperience,
} from "../application/useExperienceActions";

export default function ExperienceComponent() {
  const { setOpenDialogName } = useExperienceUiStore();

  const handleAddClick = () => {
    setOpenDialogName(EXPERIENCE_DIALOGS.CREATE);
  };

  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-2xl font-bold text-gray-900">Experience</h2>
        <Button onClick={handleAddClick} className="text-sm">
          Add Experience
        </Button>
      </div>
      <ExperiencesCards />

      <ExperienceAddDialog />

      <ExperienceEditDialog />

      <ExperienceDeleteDialog />
    </div>
  );
}

function ExperiencesCards() {
  const {
    data: experience,
    isSuccess,
    isLoading,
  } = useExperiences();
  if (isLoading) return <Loading />;

  if (isSuccess)
    return (
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 flex flex-col mb-6">
        {experience && Array.isArray(experience) && experience.length > 0 ? (
          experience.map((exp) => (
            <ExperienceCardComponent experience={exp} key={exp._id} />
          ))
        ) : (
          <NothingToDisplay />
        )}
      </div>
    );
}

function ExperienceAddDialog() {
  const { openDialogName, setOpenDialogName } = useExperienceUiStore();
  const [serverError, setServerError] = useState<any>(null);

  const createExperience = useCreateExperience({
    onSuccess: () => {
      showSuccess("Experience added successfully!");
      setOpenDialogName(null);
      setServerError(null);
    },
    onError: (error) => {
      setServerError(error);
    },
  });

  const handleSave = async (data: ExperienceFormData) => {
    setServerError(null);
    await createExperience.mutateAsync(data);
  };

  const handleCancel = () => {
    setServerError(null);
    setOpenDialogName(null);
  };

  return (
    <CustomDialog
      width="md:max-w-5xl"
      title={"Add Experience"}
      description="Add a new experience to your profile"
      dialogName={EXPERIENCE_DIALOGS.CREATE}
      openDialogName={openDialogName}
      onOpenDialogChange={setOpenDialogName}
    >
      <ExperienceForm
        onSave={handleSave}
        onCancel={handleCancel}
        serverError={serverError}
      />
    </CustomDialog>
  );
}

function ExperienceEditDialog() {
  const { openDialogName, selectedExperience, setOpenDialogName } =
    useExperienceUiStore();
  const [serverError, setServerError] = useState<any>(null);

  const editExperience = useUpdateExperience({
    onSuccess: () => {
      showSuccess("Experience updated successfully!");
      setOpenDialogName(null);
      setServerError(null);
    },
    onError: (error: any) => {
      setServerError(error);
    },
  });

  if (!selectedExperience) return null;

  const handleSave = async (data: ExperienceFormData) => {
    setServerError(null);
    await editExperience.mutateAsync({
      id: selectedExperience._id,
      data,
    });
  };

  const handleCancel = () => {
    setServerError(null);
    setOpenDialogName(null);
  };

  return (
    <CustomDialog
      width="md:max-w-5xl"
      title={"Edit Experience"}
      description="Update your experience details below"
      dialogName={EXPERIENCE_DIALOGS.EDIT}
      openDialogName={openDialogName}
      onOpenDialogChange={setOpenDialogName}
    >
      <ExperienceForm
        experience={selectedExperience}
        onSave={handleSave}
        onCancel={handleCancel}
        serverError={serverError}
      />
    </CustomDialog>
  );
}

function ExperienceDeleteDialog() {
  const {
    openDialogName,
    selectedExperience,
    setSelectedExperience,
    setOpenDialogName,
  } = useExperienceUiStore();

  const DeleteExperience = useDeleteExperience({
    onSuccess: () => {
      showSuccess("Successfully deleted experience!");
      setSelectedExperience(null);
    },
  });

  if (!selectedExperience) return null;

  const handleConfirm = async () => {
    try {
      await DeleteExperience.mutateAsync(selectedExperience._id);
      setOpenDialogName(null);
    } catch {
      // Error handling is managed by mutation hook
    }
  };

  const handleCancel = () => {
    setOpenDialogName(null);
  };

  return (
    <CustomDialog
      width="md:max-w-sm"
      title={"Delete Experience?"}
      description={`Are you sure you want to delete "${selectedExperience.jobTitle}" at "${selectedExperience.companyName}"? This action cannot be undone.`}
      dialogName={EXPERIENCE_DIALOGS.DELETE}
      openDialogName={openDialogName}
      onOpenDialogChange={setOpenDialogName}
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
  const { setOpenDialogName, setSelectedExperience } = useExperienceUiStore();
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };
  const handleEditClick = () => {
    setSelectedExperience(experience);
    setOpenDialogName(EXPERIENCE_DIALOGS.EDIT);
  };

  const handleDeleteClick = () => {
    setSelectedExperience(experience);
    setOpenDialogName(EXPERIENCE_DIALOGS.DELETE);
  };

  return (
    <Card className="w-full shrink-0 shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow mb-6">
      <CardHeader className="pb-2 md:pb-4 px-2.5 sm:px-4 md:px-6">
        <div className="flex flex-col gap-2.5 sm:gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <CardTitle className="text-xs sm:text-sm md:text-lg lg:text-2xl font-semibold text-gray-900 wrap-break-word">
                  {experience.jobTitle}
                </CardTitle>
                {experience.isCurrent && (
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 shrink-0 mt-0.5"></div>
                )}
              </div>
              <p className="text-gray-600 text-xs md:text-sm font-medium mt-0.5 sm:mt-1">
                {experience.companyName}
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 sm:h-8 sm:w-8 p-0 shrink-0"
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
              {experience.endDate ? formatDate(experience.endDate) : "Present"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2.5 sm:space-y-4 md:space-y-5 px-2.5 sm:px-4 md:px-6">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-tight sm:tracking-wide mb-1.5 sm:mb-2">
            Description
          </p>
          <p className="text-gray-700 text-xs md:text-sm leading-relaxed whitespace-pre-line">
            {experience.Descriptions}
          </p>
        </div>

        {experience.relavantDetails && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-tight sm:tracking-wide mb-1.5 sm:mb-2">
              Relevant Details
            </p>
            <p className="text-gray-700 text-xs md:text-sm leading-relaxed whitespace-pre-line">
              {experience.relavantDetails}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
