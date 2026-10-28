import type { Motif } from "@/lib/stoic/types";
import { cn } from "@/lib/utils";

const TONES = [
  { cloth: "#3a4a40", ink: "#f3efe6", rule: "#c5c0b4" },
  { cloth: "#2c3338", ink: "#f3efe6", rule: "#b9c4c8" },
  { cloth: "#4a3f36", ink: "#f3efe6", rule: "#d4c4b0" },
  { cloth: "#243028", ink: "#e8e2d4", rule: "#a8b8ac" },
  { cloth: "#3a3238", ink: "#f3efe6", rule: "#c8b8c0" },
  { cloth: "#1c1914", ink: "#f3efe6", rule: "#b9b1a3" },
];

export function BookCover({
  title,
  author,
  tone = 0,
  className,
}: {
  title: string;
  author: string;
  motif?: Motif;
  tone?: number;
  className?: string;
}) {
  const t = TONES[Math.abs(tone) % TONES.length];
  return (
    <div
      className={cn(
        "relative aspect-[2/3] overflow-hidden rounded-sm shadow-soft @container",
        className,
      )}
    >
      <svg viewBox="0 0 200 300" className="h-full w-full" aria-hidden>
        <rect width="200" height="300" fill={t.cloth} />
        <rect
          x="10"
          y="10"
          width="180"
          height="280"
          fill="none"
          stroke={t.rule}
          strokeWidth="1.2"
        />
        <rect
          x="16"
          y="16"
          width="168"
          height="268"
          fill="none"
          stroke={t.rule}
          strokeWidth="0.6"
          opacity="0.55"
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-[12%] text-center">
        <span className="mb-4 block h-px w-8" style={{ background: t.rule }} />
        <p
          className="font-display text-[clamp(0.72rem,11cqi,1.35rem)] font-semibold leading-[1.15] tracking-tight"
          style={{ color: t.ink }}
        >
          {title}
        </p>
        <p
          className="mt-3 text-[clamp(0.5rem,4.5cqi,0.7rem)] uppercase tracking-[0.18em]"
          style={{ color: t.rule }}
        >
          {author}
        </p>
        <span className="mt-4 block h-px w-8" style={{ background: t.rule }} />
      </div>
    </div>
  );
}
