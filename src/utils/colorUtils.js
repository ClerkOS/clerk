// Color utility functions for dark mode adjustments

/**
 * Converts a hex color to HSL values
 * @param {string} hex - Hex color string (e.g., "#FF0000")
 * @returns {object} - HSL values {h, s, l}
 */
function hexToHsl(hex) {
  // Remove the # if present
  hex = hex.replace('#', '');
  
  // Parse the hex values
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  
  if (max === min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
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
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {string} - Hex color string
 */
function hslToHex(h, s, l) {
  h /= 360;
  s /= 100;
  l /= 100;
  
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  const toHex = (c) => {
    const hex = Math.round(c * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Adjusts a color for dark mode by making it darker and more saturated
 * @param {string} color - Hex color string
 * @param {boolean} isDarkMode - Whether dark mode is active
 * @returns {string} - Adjusted hex color string
 */
export function adjustColorForDarkMode(color, isDarkMode) {
  if (!isDarkMode || !color) {
    return color;
  }
  
  // Skip if it's already a dark color or transparent
  if (color === 'transparent' || color === 'rgba(0,0,0,0)' || color === '#FFFFFF' || color === '#ffffff') {
    return color;
  }
  
  try {
    const hsl = hexToHsl(color);
    
    // Only adjust colors that are actually light (lightness > 60%)
    // This prevents converting already dark colors to grey
    if (hsl.l <= 60) {
      console.log(`Skipping color adjustment for ${color} - already dark (L: ${hsl.l})`);
      return color;
    }
    
    // For dark mode, we want to:
    // 1. Reduce lightness significantly (make it darker)
    // 2. Increase saturation slightly (make it more vibrant)
    // 3. Keep the same hue
    
    const adjustedHsl = {
      h: hsl.h,
      s: Math.min(100, hsl.s * 1.2), // Increase saturation by 20%
      l: Math.max(15, hsl.l * 0.4)   // Reduce lightness to 40% of original, but not below 15%
    };
    
    const adjustedColor = hslToHex(adjustedHsl.h, adjustedHsl.s, adjustedHsl.l);
    
    // Debug logging for color adjustments
    console.log(`Color adjustment: ${color} -> ${adjustedColor} (H:${hsl.h}->${adjustedHsl.h}, S:${hsl.s}->${adjustedHsl.s}, L:${hsl.l}->${adjustedHsl.l})`);
    
    return adjustedColor;
  } catch (error) {
    console.warn('Failed to adjust color for dark mode:', color, error);
    return color; // Return original color if conversion fails
  }
}

/**
 * Adjusts font color for dark mode to ensure good contrast
 * @param {string} backgroundColor - Background color hex string
 * @param {boolean} isDarkMode - Whether dark mode is active
 * @returns {string} - Appropriate font color (white or black)
 */
export function getContrastFontColor(backgroundColor, isDarkMode) {
  if (!backgroundColor || backgroundColor === 'transparent') {
    return isDarkMode ? '#ffffff' : '#000000';
  }
  
  try {
    const hsl = hexToHsl(backgroundColor);
    
    // In dark mode, we generally want white text unless the background is very light
    if (isDarkMode) {
      return hsl.l > 70 ? '#000000' : '#ffffff';
    } else {
      // In light mode, we want black text unless the background is very dark
      return hsl.l < 30 ? '#ffffff' : '#000000';
    }
  } catch (error) {
    console.warn('Failed to determine contrast font color:', backgroundColor, error);
    return isDarkMode ? '#ffffff' : '#000000';
  }
}

/**
 * Adjusts a complete style object for dark mode
 * @param {object} style - Style object with backgroundColor, fontColor, etc.
 * @param {boolean} isDarkMode - Whether dark mode is active
 * @returns {object} - Adjusted style object
 */
export function adjustStyleForDarkMode(style, isDarkMode) {
  if (!style || !isDarkMode) {
    return style;
  }
  
  const adjustedStyle = { ...style };
  
  // Adjust background color
  if (adjustedStyle.backgroundColor) {
    adjustedStyle.backgroundColor = adjustColorForDarkMode(adjustedStyle.backgroundColor, isDarkMode);
  }
  
  // Adjust font color if not explicitly set
  if (!adjustedStyle.fontColor && adjustedStyle.backgroundColor) {
    adjustedStyle.fontColor = getContrastFontColor(adjustedStyle.backgroundColor, isDarkMode);
  }
  
  // Adjust border color
  if (adjustedStyle.borderColor) {
    adjustedStyle.borderColor = adjustColorForDarkMode(adjustedStyle.borderColor, isDarkMode);
  }
  
  return adjustedStyle;
} 