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
                    DEFAULT: '#0A192F', // Deep Midnight Blue
                    50: '#e6ebf5',
                    100: '#cdd7eb',
                    200: '#9bb1db',
                    300: '#698bcb',
                    400: '#3765bb',
                    500: '#0A192F', // Core Brand Color
                    600: '#081426',
                    700: '#060f1d',
                    800: '#040a13',
                    900: '#02050a',
                },
                'secondary': {
                    DEFAULT: '#00A8E8', // Electric Blue
                    50: '#e0f6ff',
                    100: '#b3e8ff',
                    200: '#80daff',
                    300: '#4dcbff',
                    400: '#1abeff',
                    500: '#00A8E8', // Core Secondary
                    600: '#0086ba',
                    700: '#00658b',
                    800: '#00435d',
                    900: '#00222e',
                },
                'accent': {
                    DEFAULT: '#D4AF37', // Metallic Gold
                    50: '#fbf7e6',
                    100: '#f6efcc',
                    200: '#eedf99',
                    300: '#e6cf66',
                    400: '#ddbf33',
                    500: '#D4AF37', // Core Gold
                    600: '#aa8c2c',
                    700: '#806921',
                    800: '#554616',
                    900: '#2b230b',
                },
                "background-light": "#F5F5F5", // Light Grey
                "background-dark": "#0A192F", // Deep Midnight Blue
                "surface-light": "#FFFFFF",
                "surface-dark": "#112240", // Slightly lighter for cards

                "border-light": "#e5e7eb",
                "border-dark": "#1d2d50", // Adjusted for new bg

                "text-main": "#FFFFFF", // Default to white for dark theme focus
                "text-secondary": "#94A3B8", // Slate 400

                // Legacy/Compat support - mapping to new palette
                "text-primary-light": "#0e141b",
                "text-primary-dark": "#FFFFFF",
                "text-secondary-light": "#64748B",
                "text-secondary-dark": "#94A3B8",
                "card-dark": "#112240",
                "card-border": "#1d2d50",
            },
            fontFamily: {
                "display": ["Montserrat", "League Spartan", "sans-serif"],
                "body": ["Open Sans", "Lato", "sans-serif"],
                "heading": ["Montserrat", "League Spartan", "sans-serif"],
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
