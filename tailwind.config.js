import colors from './src/Components/Themes/colors.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.primary,
        accent: colors.accent,
        background: colors.background,
        cardsBackground: colors.cardsBackground,
        text: colors.text,
        mutedText: colors.mutedText,
        border: colors.border,
        hover: colors.hover,
        error: colors.error,
        success: colors.success,
        warning: colors.warning,
        info: colors.info,
      },
      backgroundImage: {
        'gradient-blue-sky': `linear-gradient(to bottom right, ${colors.gradients.blueSky[0]}, ${colors.gradients.blueSky[1]})`,
        'gradient-soft-white': `linear-gradient(to bottom right, ${colors.gradients.softWhite[0]}, ${colors.gradients.softWhite[1]})`,
        'gradient-card-glow': `linear-gradient(to bottom right, ${colors.gradients.cardGlow[0]}, ${colors.gradients.cardGlow[1]})`,
        'gradient-blue-pulse': `linear-gradient(to bottom right, ${colors.gradients.bluePulse[0]}, ${colors.gradients.bluePulse[1]})`,
      }
    },
  },
  plugins: [
    // plugin for scrollbar //
    require('tailwind-scrollbar'),
    // If you want to add hover and rounded variants
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}

