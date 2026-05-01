import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExperienceComponent from "@/features/experience/component/experience-component";

const mockExperience = {
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
};

export default function DetailsTabs() {
  return (
    <Tabs defaultValue="exp" className="w-full">
      <div className="w-full flex justify-center items-center">
        <TabsList className="">
          <TabsTrigger value="exp">Experience</TabsTrigger>
          <TabsTrigger value="qual">Qualification</TabsTrigger>
          <TabsTrigger value="proj">Project</TabsTrigger>
          <TabsTrigger value="skill">Skills</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="exp" className="h-full p-4">
        <ExperienceComponent experience={mockExperience} />
      </TabsContent>
      <TabsContent value="qual">2</TabsContent>
      <TabsContent value="proj">3</TabsContent>
      <TabsContent value="skill">4</TabsContent>
    </Tabs>
  );
}
