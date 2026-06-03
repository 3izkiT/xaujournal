import { createHash, randomBytes } from "crypto";
import { AuthTokenType } from "@prisma/client";
import { prisma } from "@/lib/db";

const TTL_HOURS: Record<AuthTokenType, number> = {
  EMAIL_VERIFY: 24,
  PASSWORD_RESET: 1,
};

function hashToken(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}

export function createRawToken() {
  return randomBytes(32).toString("base64url");
}

export async function issueAuthToken(userId: string, type: AuthTokenType) {
  const raw = createRawToken();
  const tokenHash = hashToken(raw);
  const expiresAt = new Date(Date.now() + TTL_HOURS[type] * 60 * 60 * 1000);

  await prisma.authToken.deleteMany({ where: { userId, type } });
  await prisma.authToken.create({
    data: { userId, type, tokenHash, expiresAt },
  });

  return raw;
}

export async function consumeAuthToken(raw: string, type: AuthTokenType) {
  const tokenHash = hashToken(raw);
  const row = await prisma.authToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!row || row.type !== type) return null;
  if (row.expiresAt.getTime() < Date.now()) {
    await prisma.authToken.delete({ where: { id: row.id } }).catch(() => {});
    return null;
  }

  await prisma.authToken.delete({ where: { id: row.id } });
  return row.user;
}
