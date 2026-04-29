import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.FRONTEND_URL,
);

export async function googleAuth(code) {
  const { tokens } = await client.getToken(code);
  try {
    const token = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = token.getPayload();

    return payload;
  } catch (error) {
    console.log(error);
  }
}
