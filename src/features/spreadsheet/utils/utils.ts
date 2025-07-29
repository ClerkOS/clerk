import {ImportStyle, RenderStyle} from "../../../components/spreadsheet/Cell/cellTypes";
import type { CSSProperties } from "react";

// types.ts
export interface HSL {
  h: number;
  s: number;
  l: number;
}

export const DEFAULT_BORDER_COLOR = {
  light: "#e5e7eb", // gray-200
  dark: "#374151"   // gray-700
};

// colorUtils.ts
/**
 * Converts a hex color to HSL values
 * @param hex - Hex color string (e.g., "#FF0000")
 * @returns HSL values {h, s, l}
 */
function hexToHsl(hex: string): HSL {
  // Remove the # if present
  let hexValue = hex.startsWith("#") ? hex.slice(1) : hex;

  // Validate hex length
  if (hexValue.length !== 3 && hexValue.length !== 6) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  // Expand shorthand hex (e.g., "03F" to "0033FF")
  if (hexValue.length === 3) {
    hexValue = hexValue.split("").map(c => c + c).join("");
  }

  // Parse the hex values
  const r = parseInt(hexValue.substr(0, 2), 16) / 255;
  const g = parseInt(hexValue.substr(2, 2), 16) / 255;
  const b = parseInt(hexValue.substr(4, 2), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}

/**
 * Converts HSL values to hex color
 * @param h - Hue (0-360)
 * @param s - Saturation (0-100)
 * @param l - Lightness (0-100)
 * @returns Hex color string
 */
function hslToHex(h: number, s: number, l: number): string {
  // Validate input ranges
  h = Math.max(0, Math.min(360, h));
  s = Math.max(0, Math.min(100, s));
  l = Math.max(0, Math.min(100, l));

  const hue2rgb = (p: number, q: number, t: number): number => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const hNormalized = h / 360;
  const sNormalized = s / 100;
  const lNormalized = l / 100;

  let r: number, g: number, b: number;

  if (sNormalized === 0) {
    r = g = b = lNormalized; // achromatic
  } else {
    const q = lNormalized < 0.5
      ? lNormalized * (1 + sNormalized)
      : lNormalized + sNormalized - lNormalized * sNormalized;
    const p = 2 * lNormalized - q;
    r = hue2rgb(p, q, hNormalized + 1 / 3);
    g = hue2rgb(p, q, hNormalized);
    b = hue2rgb(p, q, hNormalized - 1 / 3);
  }

  const toHex = (c: number): string => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Adjusts a color for dark mode by making it darker and more saturated
 * @param color - Hex color string
 * @param isDarkMode - Whether dark mode is active
 * @returns Adjusted hex color string
 *
 *
 * light ----------> dark
 * black text -> white text
 * white background -> dark background
 * color fill?  ->
 * dark color  -> dark color, add transparency
 * light color -> darken color, add transparency
 */
export function adjustColorForDarkMode(color: string | undefined, isDarkMode: boolean): string | undefined {
  if (!isDarkMode || !color) {
    return color;
  }

  // Skip if it's already a dark color or transparent
  if (color === "transparent" ||
    color === "rgba(0,0,0,0)" ||
    color.toLowerCase() === "#ffffff") {
    return color;
  }

  try {
    const hsl = hexToHsl(color);
    // console.log("hsl color", hsl)

    // Only adjust colors that are actually light (lightness > 60%)
    if (hsl.l <= 60) {
      // console.log(`Skipping color adjustment for ${color} - already dark (L: ${hsl.l})`);
      return color;
    }

    const adjustedHsl: HSL = {
      h: hsl.h,
      s: Math.min(100, hsl.s * 1.2), // Increase saturation by 20%
      l: Math.max(15, hsl.l * 0.4)   // Reduce lightness to 40% of original
    };

    // console.log("adjusted color", hslToHex(adjustedHsl.h, adjustedHsl.s, adjustedHsl.l))
    return hslToHex(adjustedHsl.h, adjustedHsl.s, adjustedHsl.l);
  } catch (error) {
    console.warn("Failed to adjust color for dark mode:", color, error);
    return color;
  }
}

/**
 * Adjusts font color for dark mode to ensure good contrast
 * @param backgroundColor - Background color hex string
 * @param isDarkMode - Whether dark mode is active
 * @returns Appropriate font color (white or black)
 */
export function getContrastFontColor(
  backgroundColor: string | undefined,
  isDarkMode: boolean
): string {
  if (!backgroundColor || backgroundColor === "transparent") {
    return isDarkMode ? "#FFFFFF" : "#000000";
  }

  try {
    const hsl = hexToHsl(backgroundColor);

    // In dark mode, use white text unless background is very light
    if (isDarkMode) {
      return hsl.l > 70 ? "#000000" : "#FFFFFF";
    }
    // In light mode, use black text unless background is very dark
    return hsl.l < 30 ? "#FFFFFF" : "#000000";
  } catch (error) {
    console.warn("Failed to determine contrast font color:", backgroundColor, error);
    return isDarkMode ? "#FFFFFF" : "#000000";
  }
}

/**
 * Adjusts a complete style object for dark mode (assumption is file is imported in light mode
 * @param style - Style object with backgroundColor, fontColor, etc.
 * @param isDarkMode - Whether dark mode is active
 * @returns Adjusted style object
 */
export function adjustStyleForDarkMode(style: ImportStyle, isDarkMode: boolean): CSSProperties  {
  const adjustedStyle: CSSProperties = {
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  };

  // Font weight & style
  if (style.fontBold) adjustedStyle.fontWeight = "bold";
  if (style.fontItalic) adjustedStyle.fontStyle = "italic";
  if (style.fontSize) adjustedStyle.fontSize = `${style.fontSize}px`;

  // Font color
  if (style.fontColor) {
    // console.log(style.fontColor)
    adjustedStyle.color = isDarkMode
      ? adjustColorForDarkMode(style.fontColor, isDarkMode)
      : style.fontColor;
  }

  // Adjust background color
  if (style.backgroundColor) {
    adjustedStyle.backgroundColor = isDarkMode
      ? adjustColorForDarkMode(style.backgroundColor, isDarkMode)
      : style.backgroundColor
  }

  // Adjust font color if not explicitly set
  if (!style.fontColor && style.backgroundColor) {
    adjustedStyle.color = getContrastFontColor(adjustedStyle.backgroundColor, isDarkMode);
  }

  // Text alignment
  if (style.alignment) {
    adjustedStyle.textAlign = style.alignment;
  }

  // Adjust border color
  const borderColor = style.borderColor === "#000000" || style.borderColor === "black"
    ? DEFAULT_BORDER_COLOR[isDarkMode ? "dark" : "light"]
    : style.borderColor;

  // Border styling
  if (style.borderStyle) {
    adjustedStyle.borderStyle = "solid";
    adjustedStyle.borderWidth = style.borderStyle === "thin" ? "1px" : style.borderStyle === "medium" ? "2px" : "3px";
  }
  if (borderColor) {
    adjustedStyle.borderColor = isDarkMode
      ? adjustColorForDarkMode(style.borderColor, isDarkMode )
      : borderColor;
  }

  return adjustedStyle;
}
