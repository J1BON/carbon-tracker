// ThemeProvider - Currently not in use (using Tailwind CSS instead)
// Keeping file for potential future use with Material-UI

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  // Simple passthrough - no MUI theming needed
  return <>{children}</>;
}

