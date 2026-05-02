export interface IQualification {
  _id: string;
  user: string;
  qualification: string;
  instituteName: string;
  descriptions: string;
  startDate: string;
  isCurrent: boolean;
  endDate: string | null;
  relavantDetails: string;
  __v: number;
  createdAt: string;
  updatedAt: string;
}
