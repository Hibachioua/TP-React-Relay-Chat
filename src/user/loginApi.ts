
import { Session, SessionCallback, ErrorCallback } from "../model/common";
import { CustomError } from "../model/CustomError";


const SESSION_KEY = "session";

export function saveSession(session: Session) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    sessionStorage.setItem("token", session.token);
    sessionStorage.setItem("username", session.username);
  } finally {
    window.dispatchEvent(new CustomEvent("session-changed"));
  }
}
export function getSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
} 
export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("externalId");
  window.dispatchEvent(new CustomEvent("session-changed"));
}

export function loginUser(
  identifier: string,   // 👈 au lieu de username
  password: string,
  onResult: SessionCallback,
  onError: ErrorCallback
) {
  fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }), // 👈
  })
    .then(async (response) => {
      if (response.ok) {
        const session = (await response.json()) as Session;
        console.log("Received token:", session.token);

        sessionStorage.setItem("token", session.token);
        if (session.externalId) sessionStorage.setItem("externalId", session.externalId);
        if (session.username) sessionStorage.setItem("username", session.username);
        onResult(session);
      } else {
        const err = (await response.json()) as { code?: string; message?: string };
        const ce = new CustomError(err?.message || "Échec de connexion");
        ce.code = err?.code;
        ce.httpStatus = response.status;
        onError(ce);
      }
    })
    .catch(() => {
      const ce = new CustomError("Impossible de joindre le serveur d’authentification");
      ce.code = "NETWORK_ERROR";
      onError(ce);
    });
}
