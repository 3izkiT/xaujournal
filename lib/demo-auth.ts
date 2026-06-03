import bcrypt from "bcryptjs";
import { findUserByEmail, type StoredUser } from "@/lib/auth-users";
import { DEMO_EMAIL, DEMO_PASSWORD, LEGACY_DEMO_EMAIL, LEGACY_DEMO_PASSWORD } from "@/lib/brand";
import { prisma } from "@/lib/db";

function isDemoEmail(email: string) {
  const e = email.toLowerCase();
  return e === DEMO_EMAIL || e === LEGACY_DEMO_EMAIL;
}

/** Resolve demo login when DB still has the pre-rebrand email. */
export async function findUserForLogin(email: string): Promise<StoredUser | null> {
  const normalized = email.trim().toLowerCase();
  let user = await findUserByEmail(normalized);
  if (!user && normalized === DEMO_EMAIL) {
    user = await findUserByEmail(LEGACY_DEMO_EMAIL);
  }
  return user;
}

export async function verifyLoginPassword(user: StoredUser, password: string): Promise<boolean> {
  if (await bcrypt.compare(password, user.passwordHash)) return true;
  if (!isDemoEmail(user.email)) return false;

  const hasLegacyHash = await bcrypt.compare(LEGACY_DEMO_PASSWORD, user.passwordHash);
  const hasCurrentHash = await bcrypt.compare(DEMO_PASSWORD, user.passwordHash);

  if (password === DEMO_PASSWORD && (hasCurrentHash || hasLegacyHash)) return true;
  if (password === LEGACY_DEMO_PASSWORD && (hasLegacyHash || hasCurrentHash)) return true;

  return false;
}

/** Move legacy demo row to XAURite credentials after a successful login. */
export async function migrateDemoUserAfterLogin(user: StoredUser): Promise<StoredUser> {
  if (user.email.toLowerCase() !== LEGACY_DEMO_EMAIL) return user;

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      email: DEMO_EMAIL,
      passwordHash,
      name: "Demo Trader",
    },
  });

  return {
    ...user,
    email: updated.email,
    passwordHash: updated.passwordHash,
    name: updated.name,
  };
}
