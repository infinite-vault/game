import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from './theme/theme';
import { AppRoutes } from './routing/AppRoutes';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { AutoAuthenticate } from './authentication/AutoAuthenticate';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './graphql/apolloClient';
import { SnackbarProvider } from 'notistack';
  
axios.defaults.withCredentials = true;

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <ApolloProvider client={apolloClient}>
    <BrowserRouter basename={import.meta.env.PUBLIC_URL}>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={4}>
          <AutoAuthenticate>
            <CssBaseline />
            <AppRoutes />
          </AutoAuthenticate>
        </SnackbarProvider>
      </ThemeProvider>
    </BrowserRouter>
  </ApolloProvider>,
);
