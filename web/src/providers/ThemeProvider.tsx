import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from '@/theme/theme';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline 
        enableColorScheme={false}
        // Minimal reset to allow Tailwind CSS to work alongside Material-UI
        sx={{
          '& *': {
            boxSizing: 'border-box',
          },
          // Ensure body has background color
          body: {
            margin: 0,
            padding: 0,
            backgroundColor: '#f5f5f5',
            minHeight: '100vh',
          },
          // Ensure html has height
          html: {
            height: '100%',
          },
          // Ensure root has height
          '#root': {
            minHeight: '100vh',
          },
        }}
      />
      {children}
    </MuiThemeProvider>
  );
}

