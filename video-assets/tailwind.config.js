/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                void: "#0C0A12",
                "deep-ink": "#141020",
                lavender: "#B8A9E8",
                saffron: "#E8B84A",
            },
            fontFamily: {
                serif: ["Instrument Serif", "serif"],
                sans: ["Instrument Sans", "sans-serif"],
            },
        },
    },
    plugins: [],
};
