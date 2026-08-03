const questionModules = import.meta.glob("../data/questions/*.json", {
  eager: true,
});

// Only these banks use legacy notation that should be auto-formatted as mathematics.
export function isFormulaCategory(category) {
  return /^(MTH|PHY|STA)\d+$/.test(String(category ?? ""));
}

function normalizeCourseDetails(rawDetails) {
  if (!rawDetails || typeof rawDetails !== "object") return null;

  const rawCode = String(rawDetails.code ?? rawDetails.id ?? "").trim();
  const title = String(rawDetails.title ?? rawDetails.name ?? "").trim();
  const rawDepartments = rawDetails.departments ?? rawDetails.department ?? [];
  const departments = (Array.isArray(rawDepartments) ? rawDepartments : [rawDepartments])
    .map((department) => String(department).trim())
    .filter(Boolean);
  const level = String(rawDetails.level ?? "").trim();

  if (!rawCode || !title || departments.length === 0 || !level) return null;

  const value = rawCode.replace(/\s+/g, "").toUpperCase();

  return {
    value,
    label: `${rawCode} - ${title}`,
    departments,
    level,
  };
}

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
  const courseOptionsByValue = new Map();

  // Load each question bank and use its metadata as the course catalog.
  Object.values(questionModules).forEach((moduleValue) => {
    const rawData = moduleValue?.default ?? moduleValue;

    // Handle the new structured format: { courseDetails, questions }
    if (!Array.isArray(rawData) && rawData?.questions) {
      const course = normalizeCourseDetails(rawData.courseDetails);
      if (!course) return;
      courseOptionsByValue.set(course.value, course);

      rawData.questions.forEach((entry, index) => {
        const normalized = normalizeQuestion({
          ...entry,
          category: course.value,
          // Generate an id if it's missing from the new simplified structure
          id: entry.id ?? `${course.value}-${index + 1}`,
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
            normalized.question
          ) {
          questions.push(normalized);
        }
      });
    }
  });

  const categories = new Set(questions.map((question) => question.category));
  const courseOptions = [...courseOptionsByValue.values()].filter((course) =>
    categories.has(course.value),
  );

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
