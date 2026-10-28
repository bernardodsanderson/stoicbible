/* eslint-disable react-refresh/only-export-components -- this module intentionally exports hooks/helpers with its component */
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function shareUrl(text: string, url: string) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text);
  return {
    x: `https://twitter.com/intent/tweet?text=${t}&url=${u}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    reddit: `https://www.reddit.com/submit?url=${u}&title=${t}`,
    whatsapp: `https://wa.me/?text=${t}%20${u}`,
  };
}

export function ShareMenu({
  text,
  path,
  label = "Share",
}: {
  text: string;
  path: string;
  label?: string;
}) {
  const url = typeof window === "undefined" ? path : `${window.location.origin}${path}`;
  const links = shareUrl(text, url);
  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Stoic Bible", text, url });
        return;
      } catch {
        /* fall through */
      }
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" onClick={() => void nativeShare()}>
          <Share2 />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => window.open(links.whatsapp, "_blank")}>
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(links.reddit, "_blank")}>
          Reddit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(links.linkedin, "_blank")}>
          LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(links.facebook, "_blank")}>
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(links.x, "_blank")}>X</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
