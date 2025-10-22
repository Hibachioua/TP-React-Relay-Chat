
import { Session, SessionCallback, ErrorCallback } from "../model/common";
import { CustomError } from "../model/CustomError";

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
