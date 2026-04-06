import { STORAGE_KEYS } from '../constants/storage';
import { loadJson, saveJson } from './storage';

function normalizeSession(session) {
  if (!session || typeof session !== 'object') return null;
  if (!session.id || !session.setup || !Array.isArray(session.questions) || !Array.isArray(session.answers)) {
    return null;
  }

  return {
    ...session,
    id: String(session.id),
    startedAt: session.startedAt ?? new Date().toISOString(),
    updatedAt: session.updatedAt ?? new Date().toISOString()
  };
}

export function loadSessions() {
  const collection = loadJson(STORAGE_KEYS.sessions);
  if (!Array.isArray(collection)) return [];

  return collection.map((session) => normalizeSession(session)).filter(Boolean);
}

export function saveSessions(sessions) {
  saveJson(STORAGE_KEYS.sessions, sessions);
}

export function upsertSession(session) {
  const normalized = normalizeSession(session);
  if (!normalized) return;

  const sessions = loadSessions();
  const index = sessions.findIndex((entry) => entry.id === normalized.id);
  if (index === -1) {
    sessions.push(normalized);
  } else {
    sessions[index] = normalized;
  }

  saveSessions(sessions);
}

export function removeSessionById(sessionId) {
  const targetId = String(sessionId);
  const sessions = loadSessions().filter((session) => session.id !== targetId);
  saveSessions(sessions);
}

export function getSessionById(sessionId) {
  const targetId = String(sessionId);
  return loadSessions().find((session) => session.id === targetId) ?? null;
}

export function loadPendingSessions() {
  // keeps only unfinished sessions
  return loadSessions().filter((session) => session.currentIndex < session.questions.length);
}

export function migrateLegacySessionIfPresent() {
  const legacy = loadJson(STORAGE_KEYS.session);
  if (!legacy) return;
  if (legacy.id) {
    localStorage.removeItem(STORAGE_KEYS.session);
    return;
  }

  // converts old single-session storage into the new multi-session storage
  const migrated = normalizeSession({
    ...legacy,
    id: crypto.randomUUID ? crypto.randomUUID() : `sess_${Date.now()}`
  });

  if (migrated) upsertSession(migrated);
  localStorage.removeItem(STORAGE_KEYS.session);
}
