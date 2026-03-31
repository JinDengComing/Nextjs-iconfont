// tailwind.config.js
export default {
    // 确保这里是 'selector'，这样你手动移除 .dark 类才会立刻生效
    darkMode: 'selector',
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                primary: 'var(--color-primary)',
                secondary: 'var(--color-secondary)',
                accent: 'var(--color-accent)',
            },
        },
    },
    plugins: [],
}