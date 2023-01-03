type Lesson1 = {
  name: string;
  dateOfBirth: number;
};

type Lesson2 = {
  // name: string;
  // dateOfBirth: number;
  entertained: number;
  entertainedBlock: number;
  fed: number;
  fedBlock: number;
  owner: string;
  rested: number;
  restedBlock: number;
};

export type LessonsAll = Lesson1 & Lesson2;
