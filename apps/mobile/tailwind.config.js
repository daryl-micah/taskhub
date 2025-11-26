/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Light theme colors
        background: "#0f1729",
        foreground: "#11181C",
        primary: "#3399ff",
        "primary-foreground": "#ffffff",
        secondary: "#1a2332",
        "secondary-foreground": "#8a9ba8",
        muted: "#2a3441",
        "muted-foreground": "#8a9ba8",
        accent: "#3399ff",
        "accent-foreground": "#ffffff",
        destructive: "#ff4757",
        "destructive-foreground": "#ffffff",
        border: "#2a3441",
        input: "#1a2332",
        ring: "#3399ff",

        // Custom colors for your app
        "task-high": "#ff4757",
        "task-medium": "#3742fa",
        "task-low": "#2ed573",
        "group-work": "#3399ff",
        "group-personal": "#2ed573",
        "group-shopping": "#ffa502",
      },
    },
  },
  plugins: [],
};
