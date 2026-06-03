import { isEmailVerificationRequired } from "@/lib/email-config";

export type EmailVerificationState = {
  emailVerifiedAt: Date | string | null;
};

export function isUserEmailVerified(user: EmailVerificationState) {
  if (!user.emailVerifiedAt) return false;
  return true;
}

export function mustVerifyEmailBeforeLogin(user: EmailVerificationState) {
  return isEmailVerificationRequired() && !isUserEmailVerified(user);
}
