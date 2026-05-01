export interface IExperience {
  _id: string;
  user: string;
  companyName: string;
  jobTitle: string;
  Descriptions: string;
  startDate: string;
  isCurrent: boolean;
  endDate: string | null;
  relavantDetails: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}
