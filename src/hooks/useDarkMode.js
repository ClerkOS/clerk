import { useTheme } from '../context/ThemeContext';
import { adjustColorForDarkMode, getContrastFontColor, adjustStyleForDarkMode } from '../utils/colorUtils';

/**
 * Custom hook that provides dark mode utilities
 * @returns {object} - Dark mode utilities and state
 */
export const useDarkMode = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';

  return {
    isDarkMode,
    theme,
    adjustColor: (color) => adjustColorForDarkMode(color, isDarkMode),
    getContrastColor: (backgroundColor) => getContrastFontColor(backgroundColor, isDarkMode),
    adjustStyle: (style) => adjustStyleForDarkMode(style, isDarkMode)
  };
}; 