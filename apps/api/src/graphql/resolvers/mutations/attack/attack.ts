import { Prisma } from 'database';
import { GraphQLError } from 'graphql';
import { settings } from '../../../../config/settings';
import { pubsub } from '../../../../pubsub';
import { PublishKey } from '../../../../types/PublishKey';
import { damageByStrength } from '../../../../utils/damageByStrength';
import { getRandomInt } from '../../../../utils/getRandomInt';
import { getAllActiveFightsByEnemy } from '../../helpers/getAllActiveFightsByEnemy';
import { getFight } from '../../helpers/getFight';
import { updateFight } from '../../helpers/updateFight';
import { enemyStrikesBack } from './enemyStrikesBack';
import { enemyWasDefeated } from './enemyWasDefeated';

export const attack = async (_: any, { fightId }: any, { userId }: any) => {
  // TODO: check user id
  console.log('security check', userId);

  let fight = await getFight(fightId);

  // TODO: use attack config here
  const { diceMax } = settings.attack;
  const dice = getRandomInt(0, diceMax);
  const damage = damageByStrength(fight.character?.stats?.strength as number, dice / diceMax);

  const playerAttack = { weapon: 'sword', dice, diceMax, damage };

  fight = await updateFight(fightId, { attack: playerAttack, diff: Prisma.JsonNull }, false);

  // TODO: refactor into smaller/more performant function
  const fights = await getAllActiveFightsByEnemy(fight.enemyId as number);
  const enemy = fight.enemy;

  if (!fight || !fights || !enemy) {
    throw new GraphQLError('NOT_FOUND');
  }

  const allFightsReady = fights.every((f) => f.attack);

  if (allFightsReady) {
    for (const f of fights) {
      await updateFight(f.id, { isPending: true });
    }

    setTimeout(() => finalizeAttack(enemy.id), 4000);
  } else {
    pubsub.publish(PublishKey.UPDATE_ACTION, { updateFight: { ...fight } });
  }

  return true;
};

export const finalizeAttack = async (enemyId: number) => {
  const fights = await getAllActiveFightsByEnemy(enemyId);
  const enemy = fights[0].enemy;
  let totalDamage = 0;

  if (!fights || !enemy) {
    throw new GraphQLError('NOT_FOUND');
  }

  for (const f of fights) {
    totalDamage += ((f.attack as any).damage as number) || 0;
  }

  // Hit enemy
  const enemyHpLeft = (enemy.stats?.hp as number) - totalDamage;
  const isEnemyDefeated = enemyHpLeft <= 0;

  if (isEnemyDefeated) {
    await enemyWasDefeated(enemy, fights as any);
  } else {
    await enemyStrikesBack(enemy as any, totalDamage, fights);
  }
};
