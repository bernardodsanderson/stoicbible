/* eslint-disable react-refresh/only-export-components -- this module intentionally exports hooks/helpers with its component */
import { Download, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type ShareCardPayload = {
  quote?: string | null;
  quoteAuthor?: string | null;
  thought?: string | null;
  title?: string | null;
};

const W = 1080;
const H = 1350;
const BG = "#141310";
const INK = "#e8e2d4";
const MUTED = "#c5c0b4";
const RULE = "#8a8274";
const FONT = '"Cormorant Garamond", Palatino, "Palatino Linotype", "Times New Roman", serif';

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number) {
  const words = text.replace(/\s+/g, " ").trim().split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const word of words) {
    const next = cur ? `${cur} ${word}` : word;
    if (ctx.measureText(next).width <= maxW) cur = next;
    else {
      if (cur) lines.push(cur);
      cur = word;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

function fitLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxW: number,
  fontFn: (size: number) => string,
  start: number,
  min: number,
  maxLines: number,
) {
  let size = start;
  let lines = wrap(ctx, text, maxW);
  ctx.font = fontFn(size);
  lines = wrap(ctx, text, maxW);
  while (lines.length > maxLines && size > min) {
    size -= 2;
    ctx.font = fontFn(size);
    lines = wrap(ctx, text, maxW);
  }
  const clipped = lines.length > maxLines;
  lines = lines.slice(0, maxLines);
  if (clipped && lines.length)
    lines[lines.length - 1] = `${lines[lines.length - 1].replace(/[.,;:\s]+$/, "")}…`;
  return { lines, size };
}

export async function renderShareCard(payload: ShareCardPayload) {
  try {
    await document.fonts.ready;
  } catch {
    /* use fallbacks */
  }
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not draw the card.");

  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = RULE;
  ctx.lineWidth = 2;
  ctx.strokeRect(56, 56, W - 112, H - 112);
  ctx.lineWidth = 1;
  ctx.strokeRect(72, 72, W - 144, H - 144);

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  const maxW = W - 220;
  let y = 150;

  ctx.fillStyle = MUTED;
  ctx.font = `500 22px ${FONT}`;
  ctx.fillText("S T O I C   B I B L E", W / 2, y);
  y += 56;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 36, y);
  ctx.lineTo(W / 2 + 36, y);
  ctx.stroke();
  y += 64;

  const title = payload.title?.trim();
  const quote = payload.quote?.trim();
  const thought = payload.thought?.trim();
  const author = payload.quoteAuthor?.trim();

  if (title) {
    ctx.fillStyle = INK;
    const { lines, size } = fitLines(ctx, title, maxW, (s) => `600 ${s}px ${FONT}`, 52, 32, 3);
    for (const line of lines) {
      ctx.font = `600 ${size}px ${FONT}`;
      ctx.fillText(line, W / 2, y);
      y += size + 10;
    }
    y += 28;
  }

  if (quote) {
    ctx.fillStyle = INK;
    const { lines, size } = fitLines(
      ctx,
      `“${quote}”`,
      maxW,
      (s) => `italic 500 ${s}px ${FONT}`,
      46,
      28,
      11,
    );
    for (const line of lines) {
      ctx.font = `italic 500 ${size}px ${FONT}`;
      ctx.fillText(line, W / 2, y);
      y += size + 14;
    }
    y += 18;
    if (author) {
      ctx.fillStyle = MUTED;
      ctx.font = `400 26px ${FONT}`;
      ctx.fillText(`— ${author}`, W / 2, y);
      y += 52;
    }
  }

  if (thought) {
    if (quote) {
      ctx.strokeStyle = RULE;
      ctx.beginPath();
      ctx.moveTo(W / 2 - 36, y);
      ctx.lineTo(W / 2 + 36, y);
      ctx.stroke();
      y += 40;
    }
    ctx.fillStyle = INK;
    const { lines, size } = fitLines(ctx, thought, maxW, (s) => `400 ${s}px ${FONT}`, 30, 22, 8);
    for (const line of lines) {
      ctx.font = `400 ${size}px ${FONT}`;
      ctx.fillText(line, W / 2, y);
      y += size + 12;
    }
  }

  ctx.fillStyle = MUTED;
  ctx.font = `500 18px ${FONT}`;
  ctx.fillText("READ  ·  WRITE  ·  PRACTICE", W / 2, H - 120);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Could not make the image."))),
      "image/png",
    );
  });
  return blob;
}

function captionOf(payload: ShareCardPayload) {
  const quote = payload.quote?.trim();
  const author = payload.quoteAuthor?.trim();
  const thought = payload.thought?.trim();
  const parts: string[] = [];
  if (quote) parts.push(author ? `“${quote}” — ${author}` : `“${quote}”`);
  if (thought) parts.push(thought);
  return parts.join("\n\n");
}

export function ShareCardDialog({
  open,
  onOpenChange,
  payload,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payload: ShareCardPayload;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const { quote, quoteAuthor, thought, title } = payload;

  useEffect(() => {
    if (!open) return;
    let alive = true;
    let created: string | null = null;
    void renderShareCard({ quote, quoteAuthor, thought, title })
      .then((next) => {
        if (!alive) return;
        created = URL.createObjectURL(next);
        setBlob(next);
        setUrl(created);
      })
      .catch(() => {
        if (alive) toast.error("Could not draw the card.");
      });
    return () => {
      alive = false;
      if (created) URL.revokeObjectURL(created);
    };
  }, [open, quote, quoteAuthor, thought, title]);

  async function share() {
    if (!blob) return;
    const file = new File([blob], "stoic-bible.png", { type: "image/png" });
    const text = captionOf(payload);
    try {
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: "Stoic Bible", text });
        return;
      }
      if (navigator.share) {
        await navigator.share({ title: "Stoic Bible", text });
        return;
      }
    } catch {
      /* cancelled */
      return;
    }
    await copyImage();
  }

  async function copyImage() {
    if (!blob) return;
    try {
      if (navigator.clipboard && "ClipboardItem" in window) {
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
        toast.success("Card copied.");
        return;
      }
    } catch {
      /* fall through */
    }
    const text = captionOf(payload);
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Text copied.");
    } catch {
      toast.error("Could not copy.");
    }
  }

  function download() {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "stoic-bible.png";
    a.click();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Share a card</DialogTitle>
          <DialogDescription>
            Your journal stays private. This image is what you send.
          </DialogDescription>
        </DialogHeader>
        <div className="overflow-hidden rounded-md border border-border bg-[#141310]">
          {url ? (
            <img
              src={url}
              alt="Share card"
              className="mx-auto max-h-[55vh] w-full object-contain"
            />
          ) : (
            <div className="aspect-[1080/1350] animate-pulse bg-[#1c1a16]" />
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => void share()} disabled={!blob}>
            <Share2 />
            Share
          </Button>
          <Button variant="secondary" onClick={download} disabled={!url}>
            <Download />
            Save image
          </Button>
          <Button variant="ghost" onClick={() => void copyImage()} disabled={!blob}>
            Copy
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ShareCardButton({
  payload,
  label = "Share",
  variant = "secondary",
  size = "sm",
}: {
  payload: ShareCardPayload;
  label?: string;
  variant?: "secondary" | "ghost" | "default";
  size?: "sm" | "default" | "icon";
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button type="button" variant={variant} size={size} onClick={() => setOpen(true)}>
        <Share2 />
        {size === "icon" ? <span className="sr-only">{label}</span> : label}
      </Button>
      <ShareCardDialog open={open} onOpenChange={setOpen} payload={payload} />
    </>
  );
}
