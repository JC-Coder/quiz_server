import { pickQuizQuestions } from './questions';

export function buildNewSession(setup, allQuestions) {
  const now = new Date().toISOString();

  return {
    setup,
    questions: pickQuizQuestions(allQuestions, setup.category, setup.count),
    currentIndex: 0,
    answers: [],
    startedAt: now,
    updatedAt: now
  };
}

export function buildResult(session) {
  const total = session.questions.length;
  const correct = session.answers.filter((answer) => answer?.isCorrect).length;
  const wrong = total - correct;

  return {
    setup: session.setup,
    questions: session.questions,
    answers: session.answers,
    startedAt: session.startedAt,
    completedAt: new Date().toISOString(),
    summary: {
      total,
      correct,
      wrong,
      percent: total > 0 ? Math.round((correct / total) * 100) : 0
    }
  };
}
