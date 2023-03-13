import { Suspense } from 'react';
import { CharacterList } from '../../components/Character/CharacterList';
import { GameList } from '../../components/Game/GameList';
import { GameLayout } from '../../layouts/GameLayout';

export const DashboardPage = () => {
  return (
    <GameLayout>
      <Suspense fallback="Suspending...">
        <CharacterList />
      </Suspense>
      <Suspense>
        <GameList />
      </Suspense>
    </GameLayout>
  );
};
