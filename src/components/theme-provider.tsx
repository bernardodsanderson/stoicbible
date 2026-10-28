/* eslint-disable react-refresh/only-export-components -- this module intentionally exports hooks/helpers with its component */
import { Moon, Sun } from "lucide-react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { Button } from "@/components/ui/button";
import { updateMyProfile } from "@/lib/stoic/api-user";
import { useAppAccount } from "@/lib/stoic/use-app-account";
import type { ThemeId } from "@/lib/stoic/types";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "stoic-theme";
const EVENT = "stoic-theme";

function isTheme(v: string | null): v is ThemeId {
  return v === "default" || v === "dark" || v === "dark2" || v === "dim";
}

export function isDarkTheme(theme: ThemeId) {
  return theme !== "default";
}

export function chromeColor(theme: ThemeId) {
  if (theme === "dark") return "#141310";
  if (theme === "dark2") return "#0e1210";
  if (theme === "dim") return "#1e221c";
  return "#f3efe6";
}

function syncChrome(theme: ThemeId) {
  if (typeof document === "undefined") return;
  const color = chromeColor(theme);
  const metas = document.querySelectorAll('meta[name="theme-color"]');
  metas.forEach((m) => m.setAttribute("content", color));
  const apple = document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');
  if (apple) apple.setAttribute("content", theme === "default" ? "default" : "black");
}

export function applyTheme(theme: ThemeId) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.remove("theme-dark", "theme-dark2", "theme-dim");
  if (theme !== "default") root.classList.add(`theme-${theme}`);
  root.style.colorScheme = theme === "default" ? "light" : "dark";
  syncChrome(theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function readStoredTheme(): ThemeId {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (isTheme(v)) return v;
  } catch {
    /* ignore */
  }
  return "default";
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

type ThemeCtx = { theme: ThemeId; setTheme: (theme: ThemeId) => void; toggleDark: () => void };

const ThemeContext = createContext<ThemeCtx>({
  theme: "default",
  setTheme: () => {},
  toggleDark: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(subscribe, readStoredTheme, () => "default" as ThemeId);
  const { user } = useAppAccount();

  const setTheme = useCallback(
    (next: ThemeId) => {
      applyTheme(next);
      if (user) void updateMyProfile({ data: { theme: next } }).catch(() => {});
    },
    [user],
  );

  const toggleDark = useCallback(() => {
    setTheme(isDarkTheme(theme) ? "default" : "dark");
  }, [setTheme, theme]);

  useEffect(() => {
    applyTheme(readStoredTheme());
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggleDark }), [theme, setTheme, toggleDark]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleDark } = useTheme();
  const dark = isDarkTheme(theme);
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className={cn(className)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={toggleDark}
    >
      {dark ? <Sun /> : <Moon />}
    </Button>
  );
}

export const THEME_BOOT = `(function(){try{var t=localStorage.getItem("${STORAGE_KEY}");var dark=t==="dark"||t==="dark2"||t==="dim";if(dark){document.documentElement.classList.add("theme-"+t);document.documentElement.style.colorScheme="dark"}var color=t==="dark2"?"#0e1210":t==="dim"?"#1e221c":dark?"#141310":"#f3efe6";document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.setAttribute("content",color)});var a=document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]');if(a)a.setAttribute("content",dark?"black":"default")}catch(e){}})();`;
