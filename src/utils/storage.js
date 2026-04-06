export function loadJson(key) {
  const raw = localStorage.getItem(key);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    localStorage.removeItem(key);
    return null;
  }
}

export function saveJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
