"use client";

import { FormEvent, useEffect, useState } from "react";

type Settings = {
  customChecklist: { id: string; label: string }[];
  customSetupTags: string[];
  customErrorTags: string[];
  riskModel: string;
  templatePreset: string;
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [coachUrl, setCoachUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const res = await fetch("/api/settings");
        if (res.ok) {
          const data = (await res.json()) as { settings: Settings };
          setSettings(data.settings);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    const res = await fetch("/api/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setMessage(res.ok ? "Settings saved." : "Could not save settings.");
  };

  const createCoachLink = async () => {
    const res = await fetch("/api/share", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: "Mentor read-only", expiresInDays: 30 }),
    });
    if (res.ok) {
      const data = (await res.json()) as { url: string };
      setCoachUrl(data.url);
    }
  };

  if (loading) return <p className="text-sm text-xau-muted">Loading settings…</p>;
  if (!settings) {
    return (
      <p className="text-sm text-xau-loss">
        Settings require DATABASE_URL on the server. See docs/production-db.md
      </p>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h2 className="text-3xl font-semibold text-xau-ink">Pro settings</h2>
        <p className="mt-2 text-sm text-xau-muted">Custom checklist, tags, risk model, and coach share link.</p>
      </div>

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

      <section className="xau-panel-accent">
        <h3 className="text-lg font-medium text-xau-ink">Team / coach mode</h3>
        <p className="text-sm text-xau-muted">Generate a read-only link for your mentor (30-day expiry).</p>
        <button type="button" onClick={() => void createCoachLink()} className="xau-btn-ghost mt-2">
          Create share link
        </button>
        {coachUrl && <p className="break-all text-xs text-xau-ink">{coachUrl}</p>}
      </section>
    </div>
  );
}
