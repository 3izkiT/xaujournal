import bcrypt from "bcryptjs";

export type StoredUser = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  createdAt: string;
};

const globalUsers = globalThis as unknown as { xaujournalUsers?: StoredUser[] };

function getStore(): StoredUser[] {
  if (!globalUsers.xaujournalUsers) {
    const demoHash = bcrypt.hashSync("xaujournal2026", 10);
    globalUsers.xaujournalUsers = [
      {
        id: "user-demo",
        email: "demo@xaujournal.app",
        name: "Demo Trader",
        passwordHash: demoHash,
        createdAt: new Date().toISOString(),
      },
    ];
  }
  return globalUsers.xaujournalUsers;
}

export function findUserByEmail(email: string): StoredUser | undefined {
  return getStore().find((u) => u.email === email.toLowerCase());
}

export function findUserById(id: string): StoredUser | undefined {
  return getStore().find((u) => u.id === id);
}

export async function registerUser(input: {
  email: string;
  password: string;
  name: string;
}): Promise<{ ok: true; user: StoredUser } | { ok: false; error: string }> {
  const email = input.email.trim().toLowerCase();
  if (!email.includes("@")) return { ok: false, error: "Invalid email address." };
  if (input.password.length < 8) return { ok: false, error: "Password must be at least 8 characters." };

  const store = getStore();
  if (store.some((u) => u.email === email)) {
    return { ok: false, error: "This email is already registered." };
  }

  const user: StoredUser = {
    id: `user-${Date.now()}`,
    email,
    name: input.name.trim() || email.split("@")[0],
    passwordHash: await bcrypt.hash(input.password, 10),
    createdAt: new Date().toISOString(),
  };

  store.push(user);
  return { ok: true, user };
}

export function verifyUserPassword(user: StoredUser, password: string) {
  return bcrypt.compare(password, user.passwordHash);
}
