const AUTH_KEY = "meetup-auth";

export function getSession() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.localStorage.getItem(AUTH_KEY));
  } catch {
    return null;
  }
}

export function saveSession(session) {
  window.localStorage.setItem(AUTH_KEY, JSON.stringify(session));
}

export function clearSession() {
  window.localStorage.removeItem(AUTH_KEY);
}
