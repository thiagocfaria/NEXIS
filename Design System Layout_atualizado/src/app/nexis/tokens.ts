export const T = {
  /* surfaces */
  bg:       "#EEF2FA",
  card:     "#FFFFFF",
  cardAlt:  "#F6F8FF",
  /* navy scale */
  navy:     "#1B1F5E",
  navyMd:   "#2D3280",
  navyLt:   "#3D44A8",
  /* accent */
  lime:     "#C8FF47",
  limeD:    "#A3D933",
  yellow:   "#FFD93D",
  /* semantic */
  green:    "#0A9B6E",
  greenBg:  "#E6F9F2",
  orange:   "#E05B1A",
  orangeBg: "#FEF0E8",
  purple:   "#7B3FE4",
  purpleBg: "#F0EAFF",
  red:      "#FF4757",
  redBg:    "#FFEBEC",
  online:   "#22C55E",
  /* text */
  fg:       "#1B1F5E",
  muted:    "#8891B8",
  placeholder: "rgba(136,145,184,0.6)",
  /* structure */
  border:   "rgba(27,31,94,0.07)",
  shadow:   "0 2px 16px rgba(27,31,94,0.08), 0 1px 4px rgba(27,31,94,0.04)",
  shadowMd: "0 4px 24px rgba(27,31,94,0.10), 0 1px 6px rgba(27,31,94,0.05)",
  shadowLg: "0 8px 32px rgba(27,31,94,0.14), 0 2px 8px rgba(27,31,94,0.06)",
  /* spacing */
  px: 20,
  radius: {
    sm: 10, md: 14, lg: 18, xl: 22, xxl: 28,
  },
} as const;

export type Screen =
  | "home"
  | "chat"
  | "register-sale"
  | "register-product"
  | "register-purchase"
  | "products"
  | "expenses"
  | "low-stock"
  | "reports";

export type NavigateFn = (screen: Screen) => void;
