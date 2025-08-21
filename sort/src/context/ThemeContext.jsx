// import React, { createContext, useState, useEffect, useContext } from 'react';
//
// const ThemeContext = createContext();
//
// export const ThemeProvider = ({ children }) => {
//   // Check for system preference or saved preference
//   const getInitialTheme = () => {
//     if (typeof window !== 'undefined' && window.localStorage) {
//       const storedPrefs = window.localStorage.getItem('color-theme');
//       if (typeof storedPrefs === 'string') {
//         return storedPrefs;
//       }
//
//       const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
//       if (userMedia.matches) {
//         return 'dark';
//       }
//     }
//
//     return 'light'; // Default theme
//   };
//
//   const [theme, setTheme] = useState(getInitialTheme);
//
//   const toggleTheme = () => {
//     const newTheme = theme === 'light' ? 'dark' : 'light';
//     setTheme(newTheme);
//     localStorage.setItem('color-theme', newTheme);
//   };
//
//   useEffect(() => {
//     const root = window.document.documentElement;
//
//     // Remove any existing theme classes
//     root.classList.remove('light', 'dark');
//
//     // Add the current theme class
//     root.classList.add(theme);
//
//     // Update the data-theme attribute for other libraries that might need it
//     root.setAttribute('data-theme', theme);
//   }, [theme]);
//
//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };
//
// export const useTheme = () => useContext(ThemeContext);
//
// export default ThemeContext;