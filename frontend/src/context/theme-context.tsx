import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light' | 'system';
type ColorScheme = 'stone' | 'paper' | 'ink';

const COLOR_SCHEMES: readonly ColorScheme[] = ['stone', 'paper', 'ink'] as const;

function isColorScheme(value: string | null): value is ColorScheme {
  return value !== null && COLOR_SCHEMES.includes(value as ColorScheme);
}

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultColorScheme?: ColorScheme;
  storageKey?: string;
  colorSchemeStorageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  colorScheme: ColorScheme;
  setTheme: (theme: Theme) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
};

const initialState: ThemeProviderState = {
  theme: 'system',
  colorScheme: 'stone',
  setTheme: () => null,
  setColorScheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  defaultColorScheme = 'stone',
  storageKey = 'axonhub-ui-theme',
  colorSchemeStorageKey = 'axonhub-ui-color-scheme',
  ...props
}: ThemeProviderProps) {
  const [theme, _setTheme] = useState<Theme>(() => (localStorage.getItem(storageKey) as Theme) || defaultTheme);
  const [colorScheme, _setColorScheme] = useState<ColorScheme>(() => {
    const storedColorScheme = localStorage.getItem(colorSchemeStorageKey);
    return isColorScheme(storedColorScheme) ? storedColorScheme : defaultColorScheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (theme: Theme, colorScheme: ColorScheme) => {
      // Remove existing theme and color scheme classes
      root.classList.remove('light', 'dark', ...COLOR_SCHEMES);

      const systemTheme = mediaQuery.matches ? 'dark' : 'light';
      const effectiveTheme = theme === 'system' ? systemTheme : theme;

      // Add theme and color scheme classes with transition
      root.style.transition = 'background-color 0.22s ease, color 0.22s ease, border-color 0.22s ease';
      root.classList.add(effectiveTheme, colorScheme);

      // Remove transition after animation completes
      setTimeout(() => {
        root.style.transition = '';
      }, 220);
    };

    const handleChange = () => {
      if (theme === 'system') {
        applyTheme('system', colorScheme);
      }
    };

    applyTheme(theme, colorScheme);

    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, colorScheme]);

  const setTheme = (theme: Theme) => {
    localStorage.setItem(storageKey, theme);
    _setTheme(theme);
  };

  const setColorScheme = (colorScheme: ColorScheme) => {
    localStorage.setItem(colorSchemeStorageKey, colorScheme);
    _setColorScheme(colorScheme);
  };

  const value = {
    theme,
    colorScheme,
    setTheme,
    setColorScheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider');

  return context;
};
