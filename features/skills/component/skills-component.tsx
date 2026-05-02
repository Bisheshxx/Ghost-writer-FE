"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CustomDialog from "@/shared/component/dialog/CustomDialog";
import { DIALOG_ENUMS } from "@/shared/constants";
import useUiState from "@/store/useUIStore";
import { ISkill } from "../types/skills.d";
import TechnicalListForm from "../form/technical-list.form";
import PersonalListForm from "../form/personal-list.form";
import AwardListForm from "../form/award-list.form";

export default function SkillsComponent() {
  const mockSkill: ISkill = {
    _id: "69e1bff248d57ef84f7a3s1",
    user: "69e18eeb510a6b300eebc06e",
    technicalSkills: [
      {
        category: "Frontend",
        technologies: ["React", "Next.js", "TypeScript"],
      },
      {
        category: "Backend",
        technologies: ["Node.js", "Express", "PostgreSQL"],
      },
    ],
    personalSkills: ["Communication", "Problem Solving", "Leadership"],
    awards: [
      {
        _id: "a1",
        title: "Hackathon Winner",
        details: "Won 1st place at City Hack 2023",
        issuer: "City Hack",
        issuedDate: "2023-11-01",
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    __v: 0,
  };

  const { setOpenDialogName } = useUiState();

  // store mock skill in local state for display; real app will fetch
  const [skill, setSkill] = React.useState<ISkill>(mockSkill);

  const openEditTechnical = () => {
    setOpenDialogName(DIALOG_ENUMS.EDIT_TECHNICAL_SKILL);
  };

  const openEditPersonal = () => {
    setOpenDialogName(DIALOG_ENUMS.EDIT_PERSONAL_SKILL);
  };

  const openEditAwards = () => {
    setOpenDialogName(DIALOG_ENUMS.EDIT_AWARD);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Skills</h2>
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Technical Skills</CardTitle>
          <div>
            <Button size="sm" variant="outline" onClick={openEditTechnical}>
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {skill.technicalSkills.map((t) => (
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
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Personal Skills</CardTitle>
          <div>
            <Button size="sm" variant="outline" onClick={openEditPersonal}>
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {skill.personalSkills.map((p) => (
              <span
                key={p}
                className="rounded-full border px-2 py-1 text-xs bg-gray-50"
              >
                {p}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Awards</CardTitle>
          <div>
            <Button size="sm" variant="outline" onClick={openEditAwards}>
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {skill.awards.map((a) => (
            <div key={a._id} className="border rounded p-3">
              <p className="font-semibold">{a.title}</p>
              <p className="text-xs text-gray-600">
                {a.issuer} • {a.issuedDate}
              </p>
              <p className="mt-2 text-sm">{a.details}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Edit Dialogs */}
      <CustomDialog
        title="Edit Technical Skills"
        description="Edit technical skill categories"
        dialogName={DIALOG_ENUMS.EDIT_TECHNICAL_SKILL}
        width="md:max-w-2xl"
      >
        <TechnicalListForm
          technicalSkills={skill.technicalSkills}
          onSave={(arr) => {
            setSkill((prev) => ({ ...prev, technicalSkills: arr }));
            setOpenDialogName(null);
          }}
          onCancel={() => {
            setOpenDialogName(null);
          }}
        />
      </CustomDialog>

      <CustomDialog
        title="Edit Personal Skills"
        description="Edit personal skills"
        dialogName={DIALOG_ENUMS.EDIT_PERSONAL_SKILL}
        width="md:max-w-sm"
      >
        <PersonalListForm
          personalSkills={skill.personalSkills}
          onSave={(skills) => {
            setSkill((prev) => ({ ...prev, personalSkills: skills }));
            setOpenDialogName(null);
          }}
          onCancel={() => {
            setOpenDialogName(null);
          }}
        />
      </CustomDialog>

      <CustomDialog
        title="Edit Awards"
        description="Edit awards"
        dialogName={DIALOG_ENUMS.EDIT_AWARD}
        width="md:max-w-2xl"
      >
        <AwardListForm
          awards={skill.awards}
          onSave={(awards) => {
            setSkill((prev) => ({ ...prev, awards }));
            setOpenDialogName(null);
          }}
          onCancel={() => {
            setOpenDialogName(null);
          }}
        />
      </CustomDialog>
    </div>
  );
}
