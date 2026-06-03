import Image from "next/image";
import { isInlineChartUrl } from "@/lib/chart-upload";

type Props = {
  src: string;
  alt: string;
  className?: string;
};

export function ChartImage({ src, alt, className = "h-full w-full object-cover" }: Props) {
  const broken = !src || src.startsWith("blob:");

  if (broken) {
    return (
      <div className="flex h-full min-h-[10rem] items-center justify-center bg-xau-app px-3 text-center text-xs text-xau-muted">
        No chart image — re-upload on a new log or paste an https:// link.
      </div>
    );
  }

  if (isInlineChartUrl(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={className} />
    );
  }

  return <Image src={src} alt={alt} fill className={className} sizes="(max-width: 768px) 100vw, 400px" />;
}
