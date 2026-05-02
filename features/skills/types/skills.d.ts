export interface ISkill {
  _id: string;
  user: string;
  technicalSkills: TechnicalSkill[];
  personalSkills: string[];
  awards: Award[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TechnicalSkill {
  category: string;
  technologies: string[];
}

export interface Award {
  title: string;
  details: string;
  issuer: string;
  issuedDate: string;
  _id: string;
}
