console.log("Auth configuration:", {
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID?.slice(0, 10) + "...",
  callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/google`
});

export { GET, POST } from "../../../../auth"