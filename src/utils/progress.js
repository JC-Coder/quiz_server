export function getProgressSnapshot(session) {
  if (!session || !Array.isArray(session.questions) || !Array.isArray(session.answers)) {
    return null;
  }

  const total = session.questions.length;
  const answered = session.answers.filter(Boolean).length;
  const currentQuestion = Math.min(session.currentIndex + 1, total);

  return {
    total,
    answered,
    remaining: Math.max(total - answered, 0),
    percent: total > 0 ? Math.round((answered / total) * 100) : 0,
    currentQuestion
  };
}

export function formatSavedAt(value) {
  if (!value) return 'Unknown';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Unknown';

  return parsed.toLocaleString();
}
