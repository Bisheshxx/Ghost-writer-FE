import { Button } from "@/components/ui/button";
import { IExperience } from "../types/experience-types";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
interface IProps {
  experience: IExperience[];
}
export default function ExperienceComponent({ experience }: IProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold text-gray-900">Experience</h1>
        <Button variant="outline">Add Experience</Button>
      </div>
      <Card className="w-full shadow-sm border border-gray-200 bg-white hover:shadow-md transition-shadow">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-2xl font-semibold text-gray-900">
                Full Stack Developer
              </CardTitle>
              <p className="text-gray-600 text-sm font-medium mt-1">
                WEB LAUNCH LIMITED
              </p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <div className="text-right">
                <p className="text-xs text-gray-500 font-medium">Start Date</p>
                <p className="text-sm font-semibold text-gray-900">Jan 2025</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 font-medium">End Date</p>
                <p className="text-sm font-semibold text-gray-900">Jan 2028</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="text-gray-700 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia
            asperiores id voluptate unde laborum accusamus vero perspiciatis
            ducimus. Cumque deleniti id minus totam quaerat, alias nesciunt est
            maxime neque odit?
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Key Achievements
            </p>
            <ul className="space-y-2">
              {`• Architected and deployed modern web applications using Next.js and Vercel.
• Engineered backend infrastructure with Supabase, implementing RPCs for complex API endpoints.
• Implemented secure backend logic and data handling protocols in Supabase to ensure compliance with modern privacy standards.
• Optimized data performance using advanced SQL queries for relational data manipulation.
• Shipped real-time features like instant messaging and created responsive UI/UX designs.
• Ensured scalability and maintainability of the codebase by applying modern development best practices in a fast-paced environment.`
                .split("\n")
                .map((line, idx) => (
                  <li
                    key={idx}
                    className="text-gray-700 text-sm leading-relaxed flex items-start gap-3"
                  >
                    <span className="text-gray-400 font-light mt-0.5 flex-shrink-0">
                      •
                    </span>
                    <span>{line.replace(/^•\s*/, "")}</span>
                  </li>
                ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
