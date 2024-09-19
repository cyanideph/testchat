import React from 'react';
import { useTheme } from '../hooks/useTheme';

const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
];

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="dropdown dropdown-top dropdown-end absolute bottom-4 right-4">
      <label
        tabIndex={0}
        className="btn m-1"
        aria-label="Select Theme"
      >
        Theme
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 max-h-96 overflow-y-auto"
      >
        {themes.map((t) => (
          <li key={t}>
            <a
              href="#"
              className={`block py-2 px-4 rounded-md ${
                theme === t ? 'bg-primary text-primary-foreground' : ''
              } hover:bg-primary hover:text-primary-foreground`}
              onClick={() => setTheme(t)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setTheme(t);
              }}
              aria-current={theme === t ? 'true' : 'false'}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
