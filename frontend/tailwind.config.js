/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary': {
                    DEFAULT: '#002B5B', // Deep Blue (Core)
                    50: '#f0f6fc',
                    100: '#e1ecf8',
                    200: '#c3d9f1',
                    300: '#a5c6ea',
                    400: '#68a1dc',
                    500: '#2b7ccf',
                    600: '#002B5B', // Main Brand Color
                    700: '#002249',
                    800: '#001a37',
                    900: '#001124',
                },
                'secondary': {
                    DEFAULT: '#00A86B', // Emerald Green
                    50: '#e6f7f0',
                    100: '#ccefe1',
                    200: '#99dfc3',
                    300: '#6ee7b7',
                    400: '#33bf87',
                    500: '#00A86B', // Core Green
                    600: '#008656',
                    700: '#006540',
                    800: '#00432b',
                    900: '#002215',
                },
                'accent': {
                    DEFAULT: '#D4AF37', // Gold Accent
                    50: '#fcf7eb',
                    100: '#faefd6',
                    200: '#f5dfad',
                    300: '#f0cf85',
                    400: '#ebbf5c',
                    500: '#D4AF37', // Core Gold
                    600: '#aa8c2c',
                    700: '#806921',
                    800: '#554616',
                    900: '#2b230b',
                },
                "background-light": "#F5F5F5", // Light Grey
                "background-dark": "#111921", // Dark Slate/Blue mix for UI bg
                "surface-light": "#FFFFFF",
                "surface-dark": "#1e293b",

                "border-light": "#e5e7eb",
                "border-dark": "#334155",

                "text-main": "#0e141b",
                "text-secondary": "#64748B",

                // Legacy support
                "text-primary-light": "#0e141b",
                "text-primary-dark": "#f8fafc",
                "text-secondary-light": "#64748B",
                "text-secondary-dark": "#94A3B8",
                "card-dark": "#1e293b",
                "card-border": "#334155",
            },
            fontFamily: {
                "display": ["Manrope", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "2xl": "1rem",
                "full": "9999px"
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
}
