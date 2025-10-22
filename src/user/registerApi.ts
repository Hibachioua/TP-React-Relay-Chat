// File: src/user/registerApi.ts
import { Session, SessionCallback, ErrorCallback, User } from "../model/common";
import { CustomError } from "../model/CustomError";

/**
 * Appelle /api/register et renvoie une Session (token, username, externalId, ...),
 * avec la même logique que loginUser dans loginApi.ts
 */
export function registerUser(
  user: User,
  onResult: SessionCallback,
  onError: ErrorCallback
) {
  fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // on n’envoie que ce qui est utile au register
    body: JSON.stringify({
      username: user.username,
      email: user.email,
      password: user.password,
    }),
  })
    .then(async (response) => {
      if (response.ok) {
        const session = (await response.json()) as Session;
        // aligné sur loginApi.ts
        sessionStorage.setItem("token", session.token);
        if (session.externalId) sessionStorage.setItem("externalId", session.externalId);
        if (session.username) sessionStorage.setItem("username", session.username);
        onResult(session);
      } else {
        // format d’erreur: {code, message}
        const err = (await response.json()) as { code?: string; message?: string };
        const ce = new CustomError(err?.message || "Échec d’inscription");
        ce.code = err?.code;
        ce.httpStatus = response.status;
        onError(ce);
      }
    })
    .catch((e) => {
      const ce = new CustomError("Impossible de joindre le serveur d’inscription");
      ce.code = "NETWORK_ERROR";
      onError(ce);
    });
}
