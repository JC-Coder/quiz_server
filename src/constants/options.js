export const DEPARTMENT_IDS = {
  COMPUTER_SCIENCE: "computer-science",
  MASS_COMMUNICATION: "mass-communication",
};

export const LEVEL_IDS = {
  LEVEL_100: "100",
};

export const departments = [
  { value: DEPARTMENT_IDS.COMPUTER_SCIENCE, label: "Computer Science" },
  { value: DEPARTMENT_IDS.MASS_COMMUNICATION, label: "Mass Communication" },
];

export const levels = [{ value: LEVEL_IDS.LEVEL_100, label: "100 Level" }];

export const courses = [
  {
    value: "COS101",
    label: "COS 101 - Intro to Computing",
    departments: [DEPARTMENT_IDS.COMPUTER_SCIENCE],
    level: LEVEL_IDS.LEVEL_100,
  },
  {
    value: "GST111",
    label: "GST 111 - Communication in English Language I",
    departments: [DEPARTMENT_IDS.COMPUTER_SCIENCE, DEPARTMENT_IDS.MASS_COMMUNICATION],
    level: LEVEL_IDS.LEVEL_100,
  },
  {
    value: "GST127",
    label: "GST 127 - Environmental and Sustainable Development",
    departments: [DEPARTMENT_IDS.COMPUTER_SCIENCE, DEPARTMENT_IDS.MASS_COMMUNICATION],
    level: LEVEL_IDS.LEVEL_100,
  },
  {
    value: "MTH101",
    label: "MTH 101 - Elementary Mathematics I",
    departments: [DEPARTMENT_IDS.COMPUTER_SCIENCE],
    level: LEVEL_IDS.LEVEL_100,
  },
  {
    value: "PHY101",
    label: "PHY 101 - General Physics I",
    departments: [DEPARTMENT_IDS.COMPUTER_SCIENCE],
    level: LEVEL_IDS.LEVEL_100,
  },
  {
    value: "STA111",
    label: "STA 111 - Introduction to Statistics",
    departments: [DEPARTMENT_IDS.COMPUTER_SCIENCE],
    level: LEVEL_IDS.LEVEL_100,
  },
  {
    value: "GST121",
    label: "GST 121 - Use of Library, Study Skills and ICT",
    departments: [DEPARTMENT_IDS.COMPUTER_SCIENCE, DEPARTMENT_IDS.MASS_COMMUNICATION],
    level: LEVEL_IDS.LEVEL_100,
  },
  {
    value: "PHY107",
    label: "PHY 107 - General Practical Physics I",
    departments: [DEPARTMENT_IDS.COMPUTER_SCIENCE],
    level: LEVEL_IDS.LEVEL_100,
  },
];

export const questionCounts = [10, 20, 30, 50, 70, 100];

export const quizModes = [
  {
    value: "instant",
    title: "Study Mode",
    description: "See correct answers and explanations immediately.",
  },
  {
    value: "end",
    title: "Exam Simulation",
    description: "Review all results only after finishing the entire set.",
  },
];
