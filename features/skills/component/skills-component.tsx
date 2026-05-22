"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomDialog from "@/shared/component/dialog/CustomDialog";
import { SKILLS_DIALOGS } from "../constants";
import { useSkillsUiStore } from "../store/useSkillsUiStore";
import { Award, TechnicalSkill } from "../types/skills.d";
import TechnicalListForm from "../form/technical-list.form";
import PersonalListForm from "../form/personal-list.form";
import AwardListForm from "../form/award-list.form";
import CreateSkillForm from "../form/create-skill.form";
import NothingToDisplay from "@/shared/component/NothingToDisplay";
import Loading from "@/app/loading";
import { toUTCDate } from "@/lib/date";
import { useSkills } from "../application/useSkillsActions";

export default function SkillsComponent() {
  const { data: skills, isSuccess, isLoading } = useSkills();
  const { openDialogName, setOpenDialogName } = useSkillsUiStore();
  const skillProfile = skills?.[0];

  const openCreateSkill = () => {
    setOpenDialogName(SKILLS_DIALOGS.CREATE);
  };

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-4 py-4 md:px-6">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-2xl font-bold">Skills</h2>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto pr-2 flex flex-col space-y-6">
        {isLoading ? (
          <Loading />
        ) : isSuccess && skillProfile?._id ? (
          <>
            <TechnicalSkillsComponent
              technicalSkills={skillProfile.technicalSkills || []}
            />
            <PersonalSkillsComponent
              personalSkills={skillProfile.personalSkills || []}
            />
            <AwardsComponent awards={skillProfile.awards || []} />
          </>
        ) : (
          <div className="flex flex-col flex-1 justify-center items-center h-full">
            <Button size="sm" onClick={openCreateSkill}>
              Add Skills
            </Button>
          </div>
        )}
      </div>

      <CustomDialog
        title="Create Skills"
        description="Complete all steps to create your skill profile"
        dialogName={SKILLS_DIALOGS.CREATE}
        openDialogName={openDialogName}
        onOpenDialogChange={setOpenDialogName}
        width="md:max-w-3xl"
      >
        <CreateSkillForm />
      </CustomDialog>

      {/* Edit Dialogs */}
      <CustomDialog
        title="Edit Technical Skills"
        description="Edit technical skill categories"
        dialogName={SKILLS_DIALOGS.EDIT_TECHNICAL}
        openDialogName={openDialogName}
        onOpenDialogChange={setOpenDialogName}
        width="md:max-w-2xl"
      >
        <TechnicalListForm
          technicalSkills={skillProfile?.technicalSkills || []}
          id={skillProfile?._id}
        />
      </CustomDialog>

      <CustomDialog
        title="Edit Personal Skills"
        description="Edit personal skills"
        dialogName={SKILLS_DIALOGS.EDIT_PERSONAL}
        openDialogName={openDialogName}
        onOpenDialogChange={setOpenDialogName}
        width="md:max-w-sm"
      >
        <PersonalListForm
          personalSkills={skillProfile?.personalSkills || []}
          id={skillProfile?._id}
        />
      </CustomDialog>

      <CustomDialog
        title="Edit Awards"
        description="Edit awards"
        dialogName={SKILLS_DIALOGS.EDIT_AWARD}
        openDialogName={openDialogName}
        onOpenDialogChange={setOpenDialogName}
        width="md:max-w-2xl"
      >
        <AwardListForm
          awards={skillProfile?.awards || []}
          id={skillProfile?._id}
        />
      </CustomDialog>
    </div>
  );
}

function TechnicalSkillsComponent({
  technicalSkills,
}: {
  technicalSkills: TechnicalSkill[];
}) {
  const { setOpenDialogName } = useSkillsUiStore();
  const openEditTechnical = () => {
    setOpenDialogName(SKILLS_DIALOGS.EDIT_TECHNICAL);
  };

  const isAdd =
    (technicalSkills &&
      Array.isArray(technicalSkills) &&
      technicalSkills.length === 0) ||
    technicalSkills === undefined;
  return (
    <Card className="w-full shrink-0 shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow mb-6">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Technical Skills</CardTitle>
        <div>
          <Button size="sm" variant="outline" onClick={openEditTechnical}>
            {isAdd ? "Add" : "Edit"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isAdd ? (
          <NothingToDisplay />
        ) : (
          technicalSkills?.map((t) => (
            <div
              key={t.category}
              className="flex items-center justify-between gap-4"
            >
              <div>
                <p className="font-semibold">{t.category}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {t.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border px-2 py-1 text-xs bg-gray-50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
function PersonalSkillsComponent({
  personalSkills,
}: {
  personalSkills: string[];
}) {
  const { setOpenDialogName } = useSkillsUiStore();
  const openEditPersonal = () => {
    setOpenDialogName(SKILLS_DIALOGS.EDIT_PERSONAL);
  };

  const isAdd =
    (personalSkills &&
      Array.isArray(personalSkills) &&
      personalSkills.length === 0) ||
    personalSkills === undefined;

  return (
    <Card className="w-full shrink-0 shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow mb-6">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Personal Skills</CardTitle>
        <div>
          <Button size="sm" variant="outline" onClick={openEditPersonal}>
            {isAdd ? "Add" : "Edit"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {isAdd ? (
            <NothingToDisplay />
          ) : (
            personalSkills?.map((p) => (
              <span
                key={p}
                className="rounded-full border px-2 py-1 text-xs bg-gray-50"
              >
                {p}
              </span>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
function AwardsComponent({ awards }: { awards: Award[] }) {
  const { setOpenDialogName } = useSkillsUiStore();

  const openEditAwards = () => {
    setOpenDialogName(SKILLS_DIALOGS.EDIT_AWARD);
  };

  const isAdd =
    (awards && Array.isArray(awards) && awards.length === 0) ||
    awards === undefined;
  return (
    <Card className="w-full shrink-0 shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow mb-6">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Awards</CardTitle>
        <div>
          <Button size="sm" variant="outline" onClick={openEditAwards}>
            {isAdd ? "Add" : "Edit"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {isAdd ? (
          <NothingToDisplay />
        ) : (
          awards?.map((a) => (
            <div key={a._id} className="border rounded p-3">
              <p className="font-semibold">{a.title}</p>
              <p className="text-xs text-gray-600">
                {a.issuer} • {toUTCDate(a.issuedDate)}
              </p>
              <p className="mt-2 text-sm">{a.details}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
