import { Plan } from "@prisma/client";
import { prisma } from "@/lib/db";

export type StoredUser = {
  id: string;
  email: string;
  name: string;
  passwordHash: string | null;
  plan: Plan;
  emailVerifiedAt: string | null;
  createdAt: string;
};

function normalizeUser(user: {
  id: string;
  email: string;
  name: string;
  passwordHash: string | null;
  plan: Plan;
  emailVerifiedAt: Date | null;
  createdAt: Date;
}): StoredUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    passwordHash: user.passwordHash,
    plan: user.plan,
    emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function findOrCreateGoogleUser(profile: {
  sub: string;
  email: string;
  name: string;
}): Promise<StoredUser> {
  const email = profile.email.toLowerCase();
  const verifiedNow = new Date();

  const byGoogle = await prisma.user.findUnique({ where: { googleId: profile.sub } });
  if (byGoogle) {
    if (!byGoogle.emailVerifiedAt) {
      const updated = await prisma.user.update({
        where: { id: byGoogle.id },
        data: { emailVerifiedAt: verifiedNow },
      });
      return normalizeUser(updated);
    }
    return normalizeUser(byGoogle);
  }

  const byEmail = await prisma.user.findUnique({ where: { email } });
  if (byEmail) {
    const updated = await prisma.user.update({
      where: { id: byEmail.id },
      data: {
        googleId: profile.sub,
        name: byEmail.name || profile.name,
        emailVerifiedAt: byEmail.emailVerifiedAt ?? verifiedNow,
      },
    });
    return normalizeUser(updated);
  }

  const created = await prisma.user.create({
    data: {
      email,
      name: profile.name,
      googleId: profile.sub,
      passwordHash: null,
      emailVerifiedAt: verifiedNow,
    },
  });

  return normalizeUser(created);
}

export async function findUserByEmail(email: string): Promise<StoredUser | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  return user ? normalizeUser(user) : null;
}

export async function findUserById(id: string): Promise<StoredUser | null> {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user ? normalizeUser(user) : null;
}

export async function registerUser(input: {
  email: string;
  passwordHash: string;
  name: string;
}): Promise<{ ok: true; user: StoredUser } | { ok: false; error: string }> {
  const email = input.email.trim().toLowerCase();
  if (!email.includes("@")) return { ok: false, error: "Invalid email address." };

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    return { ok: false, error: "This email is already registered." };
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: input.name.trim() || email.split("@")[0],
      passwordHash: input.passwordHash,
      emailVerifiedAt: null,
    },
  });

  return { ok: true, user: normalizeUser(user) };
}

export async function markUserEmailVerified(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { emailVerifiedAt: new Date() },
  });
}

export async function updateUserPassword(userId: string, passwordHash: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}
