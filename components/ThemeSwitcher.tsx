
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeSwitcher: React.FC = () => {
  const { theme, setThemeByName, availableThemes } = useTheme();

  return (
    <div className="absolute top-4 right-4 sm:right-6 lg:right-8 bg-[var(--card-bg)] backdrop-blur-lg rounded-full p-1 shadow-md z-10">
      <div className="flex items-center space-x-1">
        {availableThemes.map((t) => (
          <button
            key={t.name}
            onClick={() => setThemeByName(t.name)}
            className={`w-20 sm:w-24 px-3 py-1 text-sm font-medium rounded-full transition-all duration-300 ${
              theme.name === t.name
                ? 'bg-[var(--button-bg)] text-[var(--button-text)] shadow-sm'
                : 'text-[var(--text-secondary)] hover:bg-black/10 dark:hover:bg-white/10'
            }`}
            aria-pressed={theme.name === t.name}
          >
            {t.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
