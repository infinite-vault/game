import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { LogoutButton } from '../components/Logout/LogoutButton';

interface GameLayoutProps {
  children: ReactNode | ReactNode[];
}

export const GameLayout = ({ children }: GameLayoutProps) => (
  <Box>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: '20px',
        borderBottom: '1px solid lightgrey',
      }}
    >
      <Typography variant="h5">Infinite Vault</Typography>
      <LogoutButton />
    </Box>
    <Box sx={{ p: '20px' }}>{children}</Box>
  </Box>
);
