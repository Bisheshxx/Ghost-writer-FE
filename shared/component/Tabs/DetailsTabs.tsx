import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExperienceComponent from "@/features/experience/component/experience-component";
import QualificationComponent from "@/features/qualification/component/qualification-component";
import ProjectComponent from "@/features/project/component/project-component";
import SkillsComponent from "@/features/skills/component/skills-component";

export default function DetailsTabs() {
  return (
    <Tabs defaultValue="exp" className="w-full h-full">
      <div className="w-full flex justify-center items-center">
        <TabsList className="">
          <TabsTrigger value="exp">Experience</TabsTrigger>
          <TabsTrigger value="qual">Qualification</TabsTrigger>
          <TabsTrigger value="proj">Project</TabsTrigger>
          <TabsTrigger value="skill">Skills</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="exp" className="h-full p-4">
        <ExperienceComponent />
      </TabsContent>
      <TabsContent value="qual" className="h-full p-4">
        <QualificationComponent />
      </TabsContent>
      <TabsContent value="proj" className="h-full p-4">
        <ProjectComponent />
      </TabsContent>
      <TabsContent value="skill" className="h-full p-4">
        <SkillsComponent />
      </TabsContent>
    </Tabs>
  );
}
