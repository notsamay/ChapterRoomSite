// The portal's light and dark modes. The choice ("light", "dark" or "system") is remembered per
// browser. "system" leaves data-theme off .pt-root so the CSS follows prefers-color-scheme; an
// explicit choice sets data-theme="light" or "dark". Kept out of the client components so the
// server layout can inline the script that applies it before the first paint.

export type ThemePref = "light" | "dark" | "system";
export const THEME_KEY = "cr-portal-theme";

/** Runs inline as the first thing inside .pt-root, so a saved choice applies before paint. */
export const themeScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_KEY)});var r=document.currentScript&&document.currentScript.parentElement;if(r&&(t==="light"||t==="dark"))r.setAttribute("data-theme",t);}catch(e){}})();`;

export function readTheme(): ThemePref {
  try {
    const t = window.localStorage.getItem(THEME_KEY);
    return t === "light" || t === "dark" ? t : "system";
  } catch {
    return "system";
  }
}

export function applyTheme(root: Element | null, pref: ThemePref) {
  if (!root) return;
  if (pref === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", pref);
}

export function saveTheme(pref: ThemePref) {
  try {
    if (pref === "system") window.localStorage.removeItem(THEME_KEY);
    else window.localStorage.setItem(THEME_KEY, pref);
  } catch {
    // Private windows and blocked storage: the choice just lasts for this visit.
  }
}
