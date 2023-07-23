import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme/theme';
import { AppRoutes } from './routing/AppRoutes';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { AutoAuthenticate } from './authentication/AutoAuthenticate';
import { SnackbarProvider } from 'notistack';
import { socket } from './sockets';
import { getServerHttpUrl } from './utils/domains';
import ErrorBoundary from './routing/ErrorBoundary';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = getServerHttpUrl();

socket.connect();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <BrowserRouter basename={import.meta.env.PUBLIC_URL}>
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={4}>
        <AutoAuthenticate>
          <CssBaseline />
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </AutoAuthenticate>
      </SnackbarProvider>
    </ThemeProvider>
  </BrowserRouter>,
);
