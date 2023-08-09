import { Box, Button, Typography } from '@mui/material';
import { ReactNode } from 'react';

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
      <Button>Todo: Logout</Button>
    </Box>
    <Box sx={{ p: '20px' }}>{children}</Box>
  </Box>
);
