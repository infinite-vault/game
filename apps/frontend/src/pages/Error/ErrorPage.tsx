import { Box, Typography } from '@mui/material';

export const ErrorPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pt: '60px',
      }}
    >
      <Typography>Shit happens</Typography>
    </Box>
  );
};
