import { courses } from "../constants/options";

const questionModules = import.meta.glob("../data/questions/*.json", {
  eager: true,
});

function normalizeQuestion(rawQuestion) {
  if (!rawQuestion || typeof rawQuestion !== "object") return null;
  if (!Array.isArray(rawQuestion.options)) return null;

  return {
    id: String(rawQuestion.id ?? ""),
    category: String(rawQuestion.category ?? ""),
    question: String(rawQuestion.question ?? ""),
    options: rawQuestion.options.map((option) => String(option)),
    answerIndex: Number(rawQuestion.answerIndex),
    explanation: String(rawQuestion.explanation ?? ""),
  };
}

export function getQuestionCatalog() {
  const questions = [];
  const activeCourseValues = new Set(courses.map((course) => course.value));

  // loads every JSON file in src/data/questions automatically
  Object.values(questionModules).forEach((moduleValue) => {
    const rawData = moduleValue?.default ?? moduleValue;

    // Handle the new structured format: { courseDetails, questions }
    if (!Array.isArray(rawData) && rawData?.questions) {
      const category = rawData.courseDetails?.id;
      if (!category || !activeCourseValues.has(category)) return;

      rawData.questions.forEach((entry, index) => {
        const normalized = normalizeQuestion({
          ...entry,
          category,
          // Generate an id if it's missing from the new simplified structure
          id: entry.id ?? `${category}-${index + 1}`,
        });

        if (normalized && normalized.question) {
          questions.push(normalized);
        }
      });
      return;
    }

    // Handle the legacy flat array format
    if (Array.isArray(rawData)) {
      rawData.forEach((entry) => {
        const normalized = normalizeQuestion(entry);
        if (
          normalized &&
          normalized.id &&
          normalized.category &&
          normalized.question &&
          activeCourseValues.has(normalized.category)
        ) {
          questions.push(normalized);
        }
      });
    }
  });

  const categories = new Set(questions.map((question) => question.category));
  const courseOptions = courses.filter((course) => categories.has(course.value));

  return { questions, courseOptions };
}

function shuffle(items) {
  const clone = [...items];
  for (let index = clone.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [clone[index], clone[randomIndex]] = [clone[randomIndex], clone[index]];
  }
  return clone;
}

export function pickQuizQuestions(allQuestions, category, count) {
  const requestedCount = Number(count);

  if (category !== "all") {
    const byCategory = allQuestions.filter(
      (question) => question.category === category,
    );
    const cappedCount = Math.min(requestedCount, byCategory.length);
    return shuffle(byCategory).slice(0, cappedCount);
  }

  // For 'all' category, distribute evenly across categories
  const categories = [...new Set(allQuestions.map((q) => q.category))];
  const questionsByCategory = {};

  categories.forEach((cat) => {
    questionsByCategory[cat] = allQuestions.filter((q) => q.category === cat);
  });

  const selectedQuestions = [];
  const questionsPerCategory = Math.ceil(requestedCount / categories.length);

  // Distribute questions evenly across categories
  categories.forEach((cat) => {
    const available = questionsByCategory[cat];
    const count = Math.min(questionsPerCategory, available.length);
    selectedQuestions.push(...shuffle(available).slice(0, count));
  });

  // If we have more questions than needed, shuffle and slice
  if (selectedQuestions.length > requestedCount) {
    return shuffle(selectedQuestions).slice(0, requestedCount);
  }

  return shuffle(selectedQuestions);
}
