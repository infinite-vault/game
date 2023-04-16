import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface ContentContainerProps {
  children: ReactNode | ReactNode[];
}

export const ContentContainer = ({ children }: ContentContainerProps) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '10px',
        left: '70px',
        border: '1px solid grey',
        p: '12px',
        backgroundColor: 'black',
        minWidth: '250px',
      }}
    >
      {children}
    </Box>
  );
};
