import { BRAND_NAME } from "@/lib/brand";
import { emailFromAddress, isEmailConfigured } from "@/lib/email-config";
import { SITE_URL } from "@/lib/site";

type SendResult = { ok: true } | { ok: false; error: string };

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function emailShell(title: string, bodyHtml: string) {
  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;line-height:1.5;color:#131722;max-width:520px;margin:0 auto;padding:24px">
<p style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#b8860b;margin:0 0 8px">${escapeHtml(BRAND_NAME)}</p>
<h1 style="font-size:20px;margin:0 0 16px">${escapeHtml(title)}</h1>
${bodyHtml}
<p style="margin-top:32px;font-size:12px;color:#787b86">If you did not request this, you can ignore this email.</p>
</body></html>`;
}

async function sendEmail(to: string, subject: string, html: string): Promise<SendResult> {
  const from = emailFromAddress();
  const apiKey = process.env.RESEND_API_KEY?.trim();

  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[email] ${subject} → ${to}\n${html.replace(/<[^>]+>/g, " ").slice(0, 500)}`);
      return { ok: true };
    }
    return { ok: false, error: "Email is not configured on the server." };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    console.error("[email] send failed", res.status, detail);
    return { ok: false, error: "Could not send email." };
  }

  return { ok: true };
}

export async function sendVerificationEmail(input: { to: string; name: string; verifyUrl: string }) {
  const html = emailShell(
    "Verify your email",
    `<p>Hi ${escapeHtml(input.name)},</p>
<p>Thanks for joining ${escapeHtml(BRAND_NAME)}. Confirm your email to sign in and start your XAUUSD journal.</p>
<p><a href="${escapeHtml(input.verifyUrl)}" style="display:inline-block;background:#b8860b;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:600">Verify email</a></p>
<p style="font-size:13px;color:#787b86">Or copy this link:<br/><span style="word-break:break-all">${escapeHtml(input.verifyUrl)}</span></p>
<p style="font-size:13px;color:#787b86">This link expires in 24 hours.</p>`
  );

  return sendEmail(input.to, `Verify your ${BRAND_NAME} account`, html);
}

export async function sendPasswordResetEmail(input: { to: string; name: string; resetUrl: string }) {
  const html = emailShell(
    "Reset your password",
    `<p>Hi ${escapeHtml(input.name)},</p>
<p>We received a request to reset your ${escapeHtml(BRAND_NAME)} password.</p>
<p><a href="${escapeHtml(input.resetUrl)}" style="display:inline-block;background:#b8860b;color:#fff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:600">Reset password</a></p>
<p style="font-size:13px;color:#787b86">Or copy this link:<br/><span style="word-break:break-all">${escapeHtml(input.resetUrl)}</span></p>
<p style="font-size:13px;color:#787b86">This link expires in 1 hour. If you did not ask for a reset, ignore this message.</p>`
  );

  return sendEmail(input.to, `Reset your ${BRAND_NAME} password`, html);
}

export async function sendLoginNotificationEmail(input: {
  to: string;
  name: string;
  ip: string;
  userAgent: string;
  timeUtc: string;
}) {
  const html = emailShell(
    "New sign-in to your account",
    `<p>Hi ${escapeHtml(input.name)},</p>
<p>Your ${escapeHtml(BRAND_NAME)} account was just signed in.</p>
<ul style="font-size:14px;color:#434651;padding-left:20px">
<li><strong>Time (UTC):</strong> ${escapeHtml(input.timeUtc)}</li>
<li><strong>IP:</strong> ${escapeHtml(input.ip)}</li>
<li><strong>Device:</strong> ${escapeHtml(input.userAgent)}</li>
</ul>
<p style="font-size:13px;color:#787b86">If this was not you, change your password at ${escapeHtml(SITE_URL)}/forgot-password</p>`
  );

  return sendEmail(input.to, `Sign-in alert — ${BRAND_NAME}`, html);
}

export { isEmailConfigured };
