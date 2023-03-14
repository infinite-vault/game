import { Character, Enemy, Fight, Prisma, Stats, Tile } from 'database';
import { NextAction } from '../../../../types/NextAction';
import { levelByEp } from '../../../../utils/levelByEp';
import { updateCharacter } from '../../helpers/updateCharacter';
import { updateEnemy } from '../../helpers/updateEnemy';
import { updateFight } from '../../helpers/updateFight';
import { updateTile } from '../../helpers/updateTile';

export const enemyWasDefeated = async (
  enemy: Enemy,
  fights: (Fight & {
    character: Character & { stats: Stats };
    tile: Tile;
    enemy: Enemy & { stats: Stats };
  })[],
) => {
  await updateEnemy(enemy.id as number, { isDefeated: true, stats: { update: { hp: 0 } } });

  for (const f of fights) {
    const playersAttack = f.attack;

    await updateFight(f.id, {
      isOver: true,
      attack: Prisma.JsonNull,
      history: [...((f.history as any) || []), playersAttack],
    });

    const damage = (playersAttack as any).damage || 0;
    await updateCharacter(f.character?.userId as string, f.character?.gameId as string, {
      stats: {
        update: {
          level: levelByEp(damage + f.character?.stats?.ep),
          ep: { increment: damage },
        },
      },
      nextAction: NextAction.MOVE,
    });

    await updateTile(f.tile?.id as number, { type: 'defeated' });
  }
};
