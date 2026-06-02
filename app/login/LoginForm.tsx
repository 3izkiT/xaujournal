import Link from "next/link";
import { loginAction } from "@/app/login/actions";

const DEMO_EMAIL = "demo@xaujournal.app";
const DEMO_PASSWORD = "xaujournal2026";

const ERROR_MESSAGES: Record<string, string> = {
  empty: "กรุณากรอกอีเมลและรหัสผ่าน",
  invalid: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  db: "เซิร์ฟเวอร์ยังไม่ได้เชื่อมฐานข้อมูล (DATABASE_URL)",
  server: "เข้าสู่ระบบไม่สำเร็จ ลองใหม่อีกครั้ง",
};

export function LoginForm({ errorCode }: { errorCode?: string }) {
  const error = errorCode ? ERROR_MESSAGES[errorCode] ?? "เกิดข้อผิดพลาด" : null;

  return (
    <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <Link href="/" className="text-sm text-sky-600 hover:underline">
        ← Back to home
      </Link>
      <h1 className="mt-4 text-2xl font-semibold text-slate-900">Sign in to XAUJournal</h1>
      <p className="mt-2 text-sm text-slate-500">Your personal Gold trading journal workspace.</p>

      {error && (
        <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
          {error}
        </p>
      )}

      <form action={loginAction} className="mt-6 space-y-4">
        <label className="block text-sm text-slate-600">
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            defaultValue={DEMO_EMAIL}
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="you@example.com"
          />
        </label>
        <label className="block text-sm text-slate-600">
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            className="mt-1 w-full rounded-2xl border border-slate-200 px-4 py-3"
            placeholder="รหัสผ่าน"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-2xl bg-sky-100 py-3 font-medium text-sky-800 hover:bg-sky-200"
        >
          Sign in
        </button>
      </form>

      <form action={loginAction} className="mt-3">
        <input type="hidden" name="email" value={DEMO_EMAIL} />
        <input type="hidden" name="password" value={DEMO_PASSWORD} />
        <button
          type="submit"
          className="w-full rounded-2xl border border-amber-200 bg-amber-50 py-2.5 text-sm font-medium text-amber-800 hover:bg-amber-100"
        >
          Sign in as demo (คลิกครั้งเดียว)
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        No account?{" "}
        <Link href="/register" className="text-sky-600 hover:underline">
          Register
        </Link>
      </p>
      <p className="mt-4 rounded-2xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
        Demo: {DEMO_EMAIL} / {DEMO_PASSWORD}
      </p>
    </div>
  );
}
