import { Suspense } from 'react';
import { CharacterList } from '../../components/Character/CharacterList';
import { GameList } from '../../components/Game/GameList';
import { GameLayout } from '../../layouts/GameLayout';
import { Box } from '@mui/material';

export const DashboardPage = () => {
  return (
    <GameLayout>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flex: 1 }}>
          <Suspense fallback="Loading free characters...">
            <CharacterList />
          </Suspense>
        </Box>

        <Box sx={{ flex: 1 }}>
          <Suspense fallback="Loading games...">
            <GameList />
          </Suspense>
        </Box>
      </Box>
    </GameLayout>
  );
};
