"use client";

import { FormEvent, useEffect, useState } from "react";
import { DEFAULT_CHECKLIST } from "@/lib/user-settings";
import type { UserSettingsPayload } from "@/lib/user-settings-types";

type ShareLink = {
  id: string;
  token: string;
  label: string;
  expiresAt: string | null;
  createdAt: string;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<UserSettingsPayload | null>(null);
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [coachUrl, setCoachUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const [settingsRes, shareRes] = await Promise.all([fetch("/api/settings"), fetch("/api/share")]);
        if (settingsRes.ok) {
          const data = (await settingsRes.json()) as { settings: UserSettingsPayload };
          setSettings(data.settings);
        } else {
          setError("Could not load settings.");
        }
        if (shareRes.ok) {
          const data = (await shareRes.json()) as { links: ShareLink[] };
          setShareLinks(data.links);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setMessage(null);
    setError(null);
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      const data = (await res.json()) as { settings: UserSettingsPayload };
      setSettings(data.settings);
      setMessage("Settings saved.");
    } else {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Could not save settings.");
    }
  };

  const createCoachLink = async () => {
    setError(null);
    const res = await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: "Mentor read-only", expiresInDays: 30 }),
    });
    if (res.ok) {
      const data = (await res.json()) as { url: string; link: ShareLink };
      setCoachUrl(data.url);
      setShareLinks((prev) => [data.link, ...prev]);
    } else {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Could not create share link.");
    }
  };

  const revokeLink = async (id: string) => {
    setError(null);
    const res = await fetch("/api/share", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const data = (await res.json()) as { links: ShareLink[] };
      setShareLinks(data.links);
      setMessage("Share link revoked.");
    } else {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Could not revoke share link.");
    }
  };

  const updateChecklistItem = (index: number, label: string) => {
    if (!settings) return;
    const next = [...(settings.customChecklist.length ? settings.customChecklist : DEFAULT_CHECKLIST)];
    next[index] = { ...next[index], label };
    setSettings({ ...settings, customChecklist: next });
  };

  if (loading) return <p className="text-sm text-xau-muted">Loading settings…</p>;
  if (!settings) {
    return (
      <p className="text-sm text-xau-loss">
        {error ?? "Settings require DATABASE_URL on the server. See docs/production-db.md"}
      </p>
    );
  }

  const checklist = settings.customChecklist.length ? settings.customChecklist : DEFAULT_CHECKLIST;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h2 className="text-3xl font-semibold text-xau-ink">Pro settings</h2>
        <p className="mt-2 text-sm text-xau-muted">Custom checklist, tags, risk model, and coach share link.</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-xau-border bg-xau-rose px-4 py-3 text-sm text-xau-loss">{error}</div>
      )}

      <form onSubmit={handleSave} className="xau-form-section space-y-6">
        <div>
          <label className="text-sm font-medium text-xau-ink">Template preset</label>
          <select
            className="xau-select mt-2"
            value={settings.templatePreset}
            onChange={(e) => setSettings({ ...settings, templatePreset: e.target.value })}
          >
            <option value="SCALP">Scalp</option>
            <option value="INTRADAY">Intraday</option>
            <option value="SWING">Swing</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-xau-ink">Risk model</label>
          <select
            className="xau-select mt-2"
            value={settings.riskModel}
            onChange={(e) => setSettings({ ...settings, riskModel: e.target.value })}
          >
            <option value="FIXED_LOT">Fixed lot</option>
            <option value="FIXED_PERCENT">Fixed %</option>
            <option value="VOLATILITY">Volatility-based</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-xau-ink">Custom discipline checklist</label>
          <p className="mt-1 text-xs text-xau-muted">First three items appear on the journal entry form.</p>
          <div className="mt-3 space-y-2">
            {checklist.slice(0, 3).map((item, index) => (
              <input
                key={item.id}
                className="xau-field"
                value={item.label}
                onChange={(e) => updateChecklistItem(index, e.target.value)}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-xau-ink">Custom setup tags (comma-separated)</label>
          <input
            className="xau-field mt-2"
            value={settings.customSetupTags.join(", ")}
            onChange={(e) =>
              setSettings({
                ...settings,
                customSetupTags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            }
          />
        </div>

        <div>
          <label className="text-sm font-medium text-xau-ink">Custom error tags (comma-separated)</label>
          <input
            className="xau-field mt-2"
            value={settings.customErrorTags.join(", ")}
            onChange={(e) =>
              setSettings({
                ...settings,
                customErrorTags: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
              })
            }
          />
        </div>

        <button type="submit" className="rounded-2xl bg-xau-calm px-6 py-3 text-sm font-medium text-xau-ink">
          Save settings
        </button>
        {message && <p className="text-sm text-xau-muted">{message}</p>}
      </form>

      <section className="xau-panel-accent space-y-4">
        <div>
          <h3 className="text-lg font-medium text-xau-ink">Team / coach mode</h3>
          <p className="text-sm text-xau-muted">Generate a read-only link for your mentor (30-day expiry).</p>
        </div>
        <button type="button" onClick={() => void createCoachLink()} className="xau-btn-ghost">
          Create share link
        </button>
        {coachUrl && <p className="break-all text-xs text-xau-ink">{coachUrl}</p>}

        {shareLinks.length > 0 && (
          <ul className="space-y-2">
            {shareLinks.map((link) => (
              <li key={link.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-xau-border px-3 py-2 text-xs">
                <div>
                  <p className="font-medium text-xau-ink">{link.label}</p>
                  <p className="text-xau-muted">
                    {link.expiresAt ? `Expires ${new Date(link.expiresAt).toLocaleDateString()}` : "No expiry"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void revokeLink(link.id)}
                  className="text-xau-loss hover:underline"
                >
                  Revoke
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
