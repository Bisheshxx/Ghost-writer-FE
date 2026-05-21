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

export interface IPersonalSkill {
  _id: string;
  personalSkills: string[];
}

export interface IAwards {
  _id: string;
  awards: Award[];
}

export interface ITechnicalSkill {
  _id: string;
  technicalSkills: TechnicalSkill[];
}
