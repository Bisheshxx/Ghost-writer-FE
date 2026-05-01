import { Button } from "@/components/ui/button";
import { IExperience } from "../types/experience-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2 } from "lucide-react";

interface IProps {
  experience: IExperience;
}

export default function ExperienceComponent({ experience }: IProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  return (
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
                <DropdownMenuItem>
                  <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
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
  );
}
