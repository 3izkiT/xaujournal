import { Plan } from "@prisma/client";
import { prisma } from "@/lib/db";

export type StoredUser = {
  id: string;
  email: string;
  name: string;
  passwordHash: string | null;
  plan: Plan;
  createdAt: string;
};

function normalizeUser(user: {
  id: string;
  email: string;
  name: string;
  passwordHash: string | null;
  plan: Plan;
  createdAt: Date;
}): StoredUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    passwordHash: user.passwordHash,
    plan: user.plan,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function findOrCreateGoogleUser(profile: {
  sub: string;
  email: string;
  name: string;
}): Promise<StoredUser> {
  const email = profile.email.toLowerCase();

  const byGoogle = await prisma.user.findUnique({ where: { googleId: profile.sub } });
  if (byGoogle) return normalizeUser(byGoogle);

  const byEmail = await prisma.user.findUnique({ where: { email } });
  if (byEmail) {
    const updated = await prisma.user.update({
      where: { id: byEmail.id },
      data: {
        googleId: profile.sub,
        name: byEmail.name || profile.name,
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
    },
  });

  return { ok: true, user: normalizeUser(user) };
}
