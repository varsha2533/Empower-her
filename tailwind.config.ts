import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// Modern premium palette - Blue tones
				calm: {
					// Light mode colors
					lavender: '#E6F0FF',
					mutedPink: '#F0F7FF',
					softWhite: '#FAFAFA',
					paleBlue: '#E8F4F8',
					mintGreen: '#E8F5F8',
					peach: '#E8F4FF',
					coral: '#B3D9FF',
					rose: '#D6E4FF',
					// Dark mode colors
					deepNavy: '#0F172A',
					slate: '#1E293B',
					purpleAccent: '#3B82F6',
					softRed: '#F87171',
					lightPurple: '#60A5FA',
					lightMint: '#BFDBFE',
					lightRose: '#DBEAFE'
				},
				empowerHer: {
					primary: '#3B82F6',
					secondary: '#60A5FA',
					accent1: '#93C5FD',
					accent2: '#F87171',
					light1: '#F8FAFC',
					light2: '#F1F5F9',
					highlight: '#EFF6FF',
					muted: '#F8FAFC',
					purple: '#3B82F6',
					coral: '#F87171',
					teal: '#14B8A6',
					lightPurple: '#DBEAFE',
					lightCoral: '#FEE2E2',
					lightTeal: '#CCFBF1',
					gradient: {
						start: '#3B82F6',
						middle: '#60A5FA',
						end: '#93C5FD'
					}
				},
				pastel: {
					blue: '#D9F7EF',
					purple: '#DDEFE6',
					pink: '#FADADD',
					peach: '#FFE7D6',
					mint: '#CFEFE3',
					yellow: '#FFF1C7',
					lilac: '#E8E4D9',
					coral: '#F8B4A6',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'premium-glow': {
					'0%, 100%': {
						'box-shadow': '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.2), 0 0 60px rgba(147, 197, 253, 0.1)'
					},
					'50%': {
						'box-shadow': '0 0 30px rgba(59, 130, 246, 0.5), 0 0 60px rgba(59, 130, 246, 0.3), 0 0 90px rgba(147, 197, 253, 0.2)'
					}
				},
				'sos-pulse': {
					'0%, 100%': { 
						'box-shadow': '0 0 0 0 rgba(248, 113, 113, 0.7)'
					},
					'50%': { 
						'box-shadow': '0 0 0 20px rgba(248, 113, 113, 0)'
					}
				},
				'gradient-shift': {
					'0%, 100%': {
						'background-position': '0% 50%'
					},
					'50%': {
						'background-position': '100% 50%'
					}
				},
				'pulse-emergency': {
					'0%, 100%': { 
						opacity: '1',
						transform: 'scale(1)'
					},
					'50%': { 
						opacity: '0.8',
						transform: 'scale(1.05)'
					}
				},
				'gradient-flow': {
					'0%, 100%': {
						'background-position': '0% 50%'
					},
					'50%': {
						'background-position': '100% 50%'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'premium-glow': 'premium-glow 2s ease-in-out infinite',
				'sos-pulse': 'sos-pulse 2s ease-in-out infinite',
				'gradient-shift': 'gradient-shift 8s ease infinite',
				'pulse-emergency': 'pulse-emergency 1.5s ease-in-out infinite',
				'gradient-flow': 'gradient-flow 8s ease infinite'
			},
			backgroundImage: {
				'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
				'gradient-soft': 'linear-gradient(to right, var(--tw-gradient-stops))',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
