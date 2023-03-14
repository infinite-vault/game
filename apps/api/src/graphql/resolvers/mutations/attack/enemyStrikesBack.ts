import { Enemy, Prisma, Stats } from 'database';
import { settings } from '../../../../config/settings';
import { NextAction } from '../../../../types/NextAction';
import { damageByStrength } from '../../../../utils/damageByStrength';
import { getRandomInt } from '../../../../utils/getRandomInt';
import { levelByEp } from '../../../../utils/levelByEp';
import { updateCharacter } from '../../helpers/updateCharacter';
import { updateEnemy } from '../../helpers/updateEnemy';
import { updateFight } from '../../helpers/updateFight';

export const enemyStrikesBack = async (enemy: Enemy & { stats: Stats }, playerDamage: number, fights: any) => {
  const { diceMax } = settings.attack;
  const diceEnemy = getRandomInt(0, diceMax);
  const damageEnemy = damageByStrength(enemy?.stats?.strength as number, diceEnemy / diceMax);
  const enemyAttack = { weapon: 'peanuts', dice: diceEnemy, diceMax, damage: damageEnemy };
  const splittedDamage = Math.floor(damageEnemy / fights.length);

  await updateEnemy(enemy.id, {
    history: [...(enemy.history as any), enemyAttack],
    stats: {
      update: {
        hp: enemy.stats.hp - playerDamage,
      },
    },
    diff: {
      hp: -playerDamage,
    },
  });

  for (const f of fights) {
    const isPlayerDead = (f.character?.stats?.hp as number) - splittedDamage <= 0;
    const { damage } = f.attack;

    let fightData;
    let playerData;

    if (isPlayerDead) {
      fightData = {
        isOver: true,
        isPending: false,
        attack: Prisma.JsonNull,
        diff: Prisma.JsonNull,
        history: [...((f.history as any) || []), f.attack],
      };

      // TODO: reduce EP
      playerData = {
        x: 0,
        y: 0,
        stats: {
          update: {
            hp: 0,
          },
        },
        nextAction: NextAction.DEAD,
      };
    } else {
      fightData = {
        attack: Prisma.JsonNull,
        isPending: false,
        diff: {
          ep: damage,
          hp: splittedDamage,
        },
        history: [...((f.history as any) || []), f.attack],
      };

      playerData = {
        stats: {
          update: {
            level: levelByEp(damage + f.character?.stats?.ep),
            ep: { increment: damage },
            hp: { decrement: splittedDamage },
          },
        },
      };
    }

    // TODO: send only a single update to all fights and characters
    await updateFight(f.id, fightData as any);
    await updateCharacter(f.character?.userId as string, f.character?.gameId as string, playerData as any);
  }
};
