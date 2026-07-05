import type { CSSProperties } from "react";

export function getAdminThemeRootStyle(): CSSProperties {
  return {
    "--admin-accent": "#9E1728",
    "--admin-accent-hover": "#76101D",
    "--admin-info-bg": "rgba(158, 23, 40, 0.08)",
    "--admin-label": "#9E1728",
  } as CSSProperties;
}
