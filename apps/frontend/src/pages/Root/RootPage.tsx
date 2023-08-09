import { Box, Button, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
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
          <Button>Todo: Logout</Button>
        </>
      ) : (
        <Button href={RoutePaths.LOGIN}>Login</Button>
      )}
    </Box>
  );
};
