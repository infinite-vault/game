import { Box, Button, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import { LogoutButton } from '../../components/Logout/LogoutButton';
import { RoutePaths } from '../../routing/AppRoutes';
import { authAtom } from '../../store/authState';

export const RootPage = () => {
  const isAuthenticated = useAtomValue(authAtom);

  return (
    <Box>
      <Typography variant="h1">Landing Page</Typography>

      {isAuthenticated ? (
        <>
          <Button href={RoutePaths.DASHBOARD} variant="contained">
            Dashboard
          </Button>
          <LogoutButton />
        </>
      ) : (
        <Button href={RoutePaths.LOGIN}>Login</Button>
      )}
    </Box>
  );
};
