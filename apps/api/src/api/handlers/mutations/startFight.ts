import { ActionType } from 'database';
import { getActionById } from '../../queries/getActionById';
import { prisma } from '../../../prisma/prismaClient';
import { io } from '../../..';
import { SocketEvent } from 'types';

export const startFight = async ({ actionId, gameId }: any) => {
  // TODO: check user id
  console.log('TODO: security check');

  const currentAction = await getActionById(actionId);

  if (currentAction?.type !== ActionType.DRAMA) {
    throw new Error('ACTION_NO_DRAMA');
  }

  const action = await prisma.action.update({
    where: {
      id: actionId,
    },
    data: {
      type: ActionType.OVER,
    },
  });

  io.in(gameId).emit(SocketEvent.ACTION_UPDATE, { data: action });

  // // TODO: use attack config here
  // const { diceMax } = settings.attack;
  // const dice = getRandomInt(0, diceMax);
  // const damage = damageByStrength(fight.character?.stats?.strength as number, dice / diceMax);

  // const playerAttack = { weapon: 'sword', dice, diceMax, damage };

  // fight = await updateFight(fightId, { attack: playerAttack, diff: Prisma.JsonNull }, false);

  // // TODO: refactor into smaller/more performant function
  // const fights = await getAllActiveFightsByEnemy(fight.enemyId as number);
  // const enemy = fight.enemy;

  // if (!fight || !fights || !enemy) {
  //   throw new GraphQLError('NOT_FOUND');
  // }

  // const allFightsReady = fights.every((f) => f.attack);

  // if (allFightsReady) {
  //   for (const f of fights) {
  //     await updateFight(f.id, { isPending: true });
  //   }

  //   setTimeout(() => finalizeAttack(enemy.id), 4000);
  // } else {
  //   pubsub.publish(PublishKey.UPDATE_ACTION, { updateFight: { ...fight } });
  // }

  return true;
};

// export const finalizeAttack = async (enemyId: number) => {
//   const fights = await getAllActiveFightsByEnemy(enemyId);
//   const enemy = fights[0].enemy;
//   let totalDamage = 0;

//   if (!fights || !enemy) {
//     throw new GraphQLError('NOT_FOUND');
//   }

//   for (const f of fights) {
//     totalDamage += ((f.attack as any).damage as number) || 0;
//   }

//   // Hit enemy
//   const enemyHpLeft = (enemy.stats?.hp as number) - totalDamage;
//   const isEnemyDefeated = enemyHpLeft <= 0;

//   if (isEnemyDefeated) {
//     await enemyWasDefeated(enemy, fights as any);
//   } else {
//     await enemyStrikesBack(enemy as any, totalDamage, fights);
//   }
// };
