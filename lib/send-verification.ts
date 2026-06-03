import { AuthTokenType } from "@prisma/client";
import { issueAuthToken } from "@/lib/auth-tokens";
import { sendVerificationEmail } from "@/lib/email";
import { SITE_URL } from "@/lib/site";

export async function sendEmailVerificationForUser(user: { id: string; email: string; name: string }) {
  const raw = await issueAuthToken(user.id, AuthTokenType.EMAIL_VERIFY);
  const verifyUrl = `${SITE_URL}/api/auth/verify-email?token=${encodeURIComponent(raw)}`;
  return sendVerificationEmail({ to: user.email, name: user.name, verifyUrl });
}
