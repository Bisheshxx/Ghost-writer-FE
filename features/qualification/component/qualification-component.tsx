"use client";

import { Suspense, useState } from "react";
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
import { QUALIFICATION_DIALOGS } from "../constants";
import { useQualificationUiStore } from "../store/useQualificationUiStore";
import Loading from "@/app/loading";
import NothingToDisplay from "@/shared/component/NothingToDisplay";
import { showSuccess } from "@/lib/toast/toast.lib";
import { QualificationFormData } from "../schema/qualification.schema";
import {
  useCreateQualification,
  useDeleteQualification,
  useQualifications,
  useUpdateQualification,
} from "../application/useQualificationActions";

export default function QualificationComponent() {
  const { setOpenDialogName } = useQualificationUiStore();

  const handleAddClick = () => {
    setOpenDialogName(QUALIFICATION_DIALOGS.CREATE);
  };

  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-2xl font-bold text-gray-900">Qualification</h2>
        <Button onClick={handleAddClick} className="text-sm">
          Add Qualification
        </Button>
      </div>
      <Suspense fallback={<Loading />}>
        <QualificationCards />
      </Suspense>
      <QualificationAddDialog />

      <QualificationEditDialog />

      <QualificationDeleteDialog />
    </div>
  );
}
function QualificationCards() {
  const {
    data: qualification,
    isSuccess,
    isLoading,
  } = useQualifications();
  if (isLoading) return <Loading />;
  if (isSuccess)
    return (
      <div className="flex-1 min-h-0 overflow-y-auto pr-2 flex flex-col mb-6">
        {qualification &&
        Array.isArray(qualification) &&
        qualification.length > 0 ? (
          qualification.map((qualification) => (
            <QualificationCardComponent
              qualification={qualification}
              key={qualification._id}
            />
          ))
        ) : (
          <NothingToDisplay />
        )}
      </div>
    );
}

function QualificationAddDialog() {
  const { openDialogName, setOpenDialogName } = useQualificationUiStore();
  const [serverError, setServerError] = useState<any>(null);

  const createQualification = useCreateQualification({
    onSuccess: () => {
      showSuccess("Qualification added successfully!");
      setOpenDialogName(null);
      setServerError(null);
    },
    onError: (error) => {
      setServerError(error);
    },
  });

  const handleSave = async (data: QualificationFormData) => {
    setServerError(null);
    await createQualification.mutateAsync(data);
  };

  const handleCancel = () => {
    setServerError(null);
    setOpenDialogName(null);
  };

  return (
    <CustomDialog
      width="md:max-w-5xl"
      title={"Add Qualification"}
      description="Add a new qualification to your profile"
      dialogName={QUALIFICATION_DIALOGS.CREATE}
      openDialogName={openDialogName}
      onOpenDialogChange={setOpenDialogName}
    >
      <QualificationForm
        onSave={handleSave}
        onCancel={handleCancel}
        serverError={serverError}
      />
    </CustomDialog>
  );
}

function QualificationEditDialog() {
  const { openDialogName, selectedQualification, setOpenDialogName } =
    useQualificationUiStore();
  const [serverError, setServerError] = useState<any>(null);

  const editQualification = useUpdateQualification({
    onSuccess: () => {
      showSuccess("Qualification updated successfully!");
      setOpenDialogName(null);
      setServerError(null);
    },
    onError: (error: any) => {
      setServerError(error);
    },
  });

  if (!selectedQualification) return null;

  const handleSave = async (data: QualificationFormData) => {
    setServerError(null);
    await editQualification.mutateAsync({
      id: selectedQualification._id,
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
      title={"Edit Qualification"}
      description="Update your qualification details below"
      dialogName={QUALIFICATION_DIALOGS.EDIT}
      openDialogName={openDialogName}
      onOpenDialogChange={setOpenDialogName}
    >
      <QualificationForm
        qualification={selectedQualification}
        onSave={handleSave}
        onCancel={handleCancel}
        serverError={serverError}
      />
    </CustomDialog>
  );
}

function QualificationDeleteDialog() {
  const {
    openDialogName,
    selectedQualification,
    setSelectedQualification,
    setOpenDialogName,
  } = useQualificationUiStore();

  const DeleteQualification = useDeleteQualification({
    onSuccess: () => {
      showSuccess("Successfully deleted qualification!");
      setSelectedQualification(null);
    },
  });

  if (!selectedQualification) return null;

  const handleConfirm = async () => {
    try {
      await DeleteQualification.mutateAsync(selectedQualification._id);
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
      title={"Delete Qualification?"}
      description={`Are you sure you want to delete "${selectedQualification.instituteName}"? This action cannot be undone.`}
      dialogName={QUALIFICATION_DIALOGS.DELETE}
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

const QualificationCardComponent = ({
  qualification,
}: {
  qualification: IQualification;
}) => {
  const { setOpenDialogName, setSelectedQualification } =
    useQualificationUiStore();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const handleEditClick = () => {
    setSelectedQualification(qualification);
    setOpenDialogName(QUALIFICATION_DIALOGS.EDIT);
  };

  const handleDeleteClick = () => {
    setSelectedQualification(qualification);
    setOpenDialogName(QUALIFICATION_DIALOGS.DELETE);
  };

  return (
    <Card className="w-full shrink-0 shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow mb-6">
      <CardHeader className="pb-2 md:pb-4 px-2.5 sm:px-4 md:px-6">
        <div className="flex flex-col gap-2.5 sm:gap-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <CardTitle className="text-xs sm:text-sm md:text-lg lg:text-2xl font-semibold text-gray-900 wrap-break-word">
                  {qualification.qualification}
                </CardTitle>
                {qualification.isCurrent && (
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 shrink-0 mt-0.5"></div>
                )}
              </div>
              <p className="text-gray-600 text-xs md:text-sm font-medium mt-0.5 sm:mt-1">
                {qualification.instituteName}
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
          <p className="text-gray-700 text-xs md:text-sm leading-relaxed whitespace-pre-line">
            {qualification.descriptions}
          </p>
        </div>

        {qualification.relavantDetails && (
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-tight sm:tracking-wide mb-1.5 sm:mb-2">
              Relevant Details
            </p>
            <p className="text-gray-700 text-xs md:text-sm leading-relaxed whitespace-pre-line ">
              {qualification.relavantDetails}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
