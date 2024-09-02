import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors:{
        primary: {
          '0':'#008080',
          1:'#A4FFFF',
          2:'#94F2F2',
          3:'#73D7D7',
          4:'#42B0B0',
          5:'#006262',
          6:'#004A4A',
          7:'#002525',
          8:'#001919',
          9:'#000C0C',
        },
        secondry : {
          '0':'#FFD700',
          1:'#FFFFFF',
          2:'#FFFBE5',
          3:'#FFEF99',
          4:'#FFE766',
          5:'#FFDF33',
          6:'#FFD700',
          7:'#665600',
          8:'#332B00',
          9:'#1A1600',
        },
        tertiary: {
          '0':'#0D0D0D',
          1:'#A1A1A1',
          2:'#929292',
          3:'#757575',
          4:'#666666',
          5:'#484848',
          6:'#2B2B2B',
          7:'#0D0D0D',
          8:'#0A0A0A',
        },
        neutral: {
          '0':'#0D0D0D',
          1:'#FFFFFF',
          2:'#E1E1E1',
          3:'#C4C4C4',
          4:'#A6A6A6',
          5:'#979797',
          6:'#898989',
          7:'#7A7A7A',
          8:'#6B6B6B',
        },
        positive: {
          1:'#170604',
          2:'#2F0B08',
          3:'#5E1610',
          4:'#BB2D21',
          5:'#EA3829',
          6:'#EE6054',
          7:'#F2887F',
          8:'#FDEBEA',
        }
      },
      fontFamily: {
        poppins : ['Poppins', 'sans-serif'],
        swiss : ['Swiss721BoldExtendedBT', 'sans-serif']
      },
      boxShadow: {
        'custom': '-1px 4px 41.7px 15px rgba(0, 128, 128, 0.5)',
      },
      backgroundImage: {
        'custom': 'linear-gradient(90deg, #008080 0%, #9F890E 100%)',
        'btn-gradient-0': 'linear-gradient(90deg, #008080 0%, #9F890E 100%)',
        'btn-gradient-1': 'linear-gradient(90deg, white 0%, #9F890E 100%)',
      },
      animation: {
        spin: 'spin 1.5s linear infinite',
        ring: 'ring 1.5s linear infinite',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        ring: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '100%': { transform: 'rotate(360deg) scale(0.5)' },
        },
      },
    },
  },
  plugins: [],
};
export default config;
