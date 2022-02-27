import * as jwt from "jsonwebtoken";

export const APP_SECRET = "GraphQL-is-aw3some"

export interface AuthTokenPayload { // Interface from JWT issued during "signup" and "login"
  userId: number;
}

export function decodeAuthHeader(authHeader: String): AuthTokenPayload { // "decodeAuthHeader" takes "Authorization" header and parses to return payload
  const token = authHeader.replace("Bearer ", ""); // "Authorization" header contains Type of auth & token. "Bearer" represents auth scheme.

  if (!token) {
      throw new Error("No token found");
  }
  return jwt.verify(token, APP_SECRET) as AuthTokenPayload; // Decode token
}