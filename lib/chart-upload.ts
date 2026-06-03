import { beforePlaceholder, afterPlaceholder } from "@/lib/data";

export const MAX_CHART_FILE_BYTES = 2_500_000;

export { beforePlaceholder, afterPlaceholder };

export function readImageFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please choose an image file (PNG, JPG, WebP)."));
      return;
    }
    if (file.size > MAX_CHART_FILE_BYTES) {
      reject(new Error("Image is too large. Max 2.5 MB per chart."));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") resolve(result);
      else reject(new Error("Could not read image."));
    };
    reader.onerror = () => reject(new Error("Could not read image."));
    reader.readAsDataURL(file);
  });
}

/** Persistable chart URL — blob: links break after reload. */
export function sanitizeChartUrl(url: unknown, fallback: string): string {
  if (typeof url !== "string") return fallback;
  const trimmed = url.trim();
  if (!trimmed || trimmed.startsWith("blob:")) return fallback;
  if (trimmed.startsWith("data:image/")) {
    if (trimmed.length > 4_000_000) {
      throw new Error("Chart image is too large to store. Use a smaller screenshot or paste an https URL.");
    }
    return trimmed;
  }
  if (trimmed.startsWith("https://") || trimmed.startsWith("http://")) return trimmed;
  return fallback;
}

export function isInlineChartUrl(url: string) {
  return url.startsWith("blob:") || url.startsWith("data:");
}
