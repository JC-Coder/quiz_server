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
