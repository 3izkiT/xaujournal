import Image from "next/image";
import { isInlineChartUrl } from "@/lib/chart-upload";

type Props = {
  src: string;
  alt: string;
  className?: string;
  /** cover = fill box; contain = full image (portrait or landscape) */
  fit?: "cover" | "contain";
};

export function ChartImage({ src, alt, className, fit = "cover" }: Props) {
  const broken = !src || src.startsWith("blob:");

  if (broken) {
    return (
      <div className="flex h-full min-h-[10rem] items-center justify-center bg-xau-app px-3 text-center text-xs text-xau-muted">
        No chart image — re-upload on a new log or paste an https:// link.
      </div>
    );
  }

  const coverClass = className ?? "h-full w-full object-cover";
  const containClass = className ?? "max-h-full max-w-full object-contain";

  if (fit === "contain") {
    return (
      <div className="flex h-full w-full items-center justify-center p-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt} className={containClass} />
      </div>
    );
  }

  if (isInlineChartUrl(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={coverClass} />
    );
  }

  return <Image src={src} alt={alt} fill className={coverClass} sizes="(max-width: 768px) 100vw, 400px" />;
}
