import { isLoginNotifyEnabled } from "@/lib/email-config";
import { sendLoginNotificationEmail } from "@/lib/email";
import { clientIp, clientUserAgent, loginTimeUtc } from "@/lib/request-meta";

/** Non-blocking login alert — failures are logged only. */
export function notifyLoginByEmail(request: Request, user: { email: string; name: string }) {
  if (!isLoginNotifyEnabled()) return;

  void sendLoginNotificationEmail({
    to: user.email,
    name: user.name,
    ip: clientIp(request),
    userAgent: clientUserAgent(request),
    timeUtc: loginTimeUtc(),
  }).catch((err) => console.error("[login-notify]", err));
}
