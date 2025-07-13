import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    saiyan: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316', // Primary orange
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
    dragon: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444', // Red for energy
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
    ki: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Blue for ki energy
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    anime: {
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb',
      pink: '#ff6b9d',
      purple: '#a855f7',
      blue: '#3b82f6',
      indigo: '#6366f1',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      gradient2: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      gradient3: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
    brand: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316', // Primary orange
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
    },
  },
  fonts: {
    heading: '"Poppins", "Orbitron", "Roboto", sans-serif',
    body: '"Inter", "Roboto", sans-serif',
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'saiyan',
      },
      variants: {
        solid: {
          bg: 'saiyan.500',
          color: 'white',
          borderRadius: 'xl',
          _hover: {
            bg: 'saiyan.600',
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
          _active: {
            bg: 'saiyan.700',
          },
        },
        outline: {
          borderColor: 'saiyan.500',
          color: 'saiyan.500',
          borderRadius: 'xl',
          _hover: {
            bg: 'saiyan.50',
            borderColor: 'saiyan.600',
          },
        },
        ghost: {
          color: 'saiyan.500',
          borderRadius: 'xl',
          _hover: {
            bg: 'saiyan.50',
          },
        },
        gradient: {
          bgGradient: 'linear(to-r, anime.pink, anime.purple)',
          color: 'white',
          borderRadius: 'xl',
          _hover: {
            bgGradient: 'linear(to-r, anime.purple, anime.pink)',
            transform: 'translateY(-2px)',
            boxShadow: 'lg',
          },
        },
      },
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'saiyan.500',
      },
      variants: {
        filled: {
          field: {
            bg: 'gray.50',
            borderRadius: 'xl',
            _focus: {
              bg: 'white',
              borderColor: 'saiyan.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-saiyan-500)',
            },
          },
        },
      },
    },
    Select: {
      defaultProps: {
        focusBorderColor: 'saiyan.500',
      },
    },
    Badge: {
      variants: {
        solid: {
          bg: 'saiyan.500',
          color: 'white',
          borderRadius: 'full',
        },
        gradient: {
          bgGradient: 'linear(to-r, anime.pink, anime.purple)',
          color: 'white',
          borderRadius: 'full',
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          boxShadow: 'lg',
          overflow: 'hidden',
          transition: 'all 0.3s',
          _hover: {
            transform: 'translateY(-4px)',
            boxShadow: '2xl',
          },
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  },
});

export default theme; 