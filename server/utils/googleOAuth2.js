import { google } from "googleapis";

const config = {
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
};


export function createOAuthClient() {
  return new google.auth.OAuth2(config.clientId, config.clientSecret);
}

export function getAuthenticatedClient({ token }) {
  const client = createOAuthClient();
  client.setCredentials({ access_token: token });
  return client;
}
