import { google } from "googleapis";
import { config } from "../config/google.js";

export function createOAuthClient() {
  return new google.auth.OAuth2(config.clientId, config.clientSecret);
}

export function getAuthenticatedClient({ token }) {
  const client = createOAuthClient();
  client.setCredentials({ access_token: token });
  return client;
}
