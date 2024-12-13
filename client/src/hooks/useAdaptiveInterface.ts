import { useState, useEffect } from 'react';

interface AdaptiveTheme {
  primary: string;
  secondary: string;
  background: string;
  greeting: string;
}

export function useAdaptiveInterface() {
  const [theme, setTheme] = useState<AdaptiveTheme>({
    primary: 'from-pink-500 to-purple-500',
    secondary: 'from-pink-400 to-purple-400',
    background: 'from-black/90 via-black/85 to-purple-900/80',
    greeting: 'Bonne soirée'
  });

  useEffect(() => {
    const updateTheme = () => {
      const hour = new Date().getHours();
      
      if (hour >= 5 && hour < 12) {
        setTheme({
          primary: 'from-amber-500 to-orange-500',
          secondary: 'from-amber-400 to-orange-400',
          background: 'from-black/90 via-black/85 to-amber-900/80',
          greeting: 'Bonjour'
        });
      } else if (hour >= 12 && hour < 17) {
        setTheme({
          primary: 'from-blue-500 to-cyan-500',
          secondary: 'from-blue-400 to-cyan-400',
          background: 'from-black/90 via-black/85 to-blue-900/80',
          greeting: 'Bon après-midi'
        });
      } else if (hour >= 17 && hour < 21) {
        setTheme({
          primary: 'from-pink-500 to-purple-500',
          secondary: 'from-pink-400 to-purple-400',
          background: 'from-black/90 via-black/85 to-purple-900/80',
          greeting: 'Bonne soirée'
        });
      } else {
        setTheme({
          primary: 'from-indigo-500 to-purple-500',
          secondary: 'from-indigo-400 to-purple-400',
          background: 'from-black/90 via-black/85 to-indigo-900/80',
          greeting: 'Bonne nuit'
        });
      }
    };

    updateTheme();
    const interval = setInterval(updateTheme, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);

  return theme;
}
