import {
  ActionType,
  Loot,
  CharacterWithRelations,
  Prisma,
  Action,
  PrismaClient,
  TileType,
} from 'database';
import { getActionById } from '../../queries/getActionById';
import { prisma } from '../../../prisma/prismaClient';
import { io } from '../../..';
import { BattleLog, BattleLogProps, SocketEvent } from 'types';
import { levelByEp } from 'utils';
import { getRandomArbitrary } from '../../../utils/getRandomArbitrary';
import { settings } from '../../../config/settings';
import { getRandomWeightedBoolean } from '../../../utils/getRandomWeightedBoolean';
import { getLootstats } from '../../../utils/getLootStats';
import { getValueOrZero } from '../../../utils/getValueOrZero';
import { DefaultArgs } from 'database/generated/prisma-client/runtime/library';

export const startFight = async ({ actionId, gameId }: any) => {
  // TODO: check user id
  console.log('TODO: security check');

  try {
    calculateFight(actionId, gameId);
  } catch (err) {
    console.error(`error during action #${actionId}`, err);
  }

  return true;
};

const calculateFight = async (actionId: number, gameId: string) => {
  const currentAction = await getActionById(actionId);

  if (currentAction?.type !== ActionType.DRAMA) {
    throw new Error('ACTION_NO_DRAMA');
  }

  if (currentAction.characters.length !== 2) {
    throw new Error(
      `wrong character count (${currentAction.characters.length}) in action #${actionId}`,
    );
  }

  // TODO: shuffle opponents by weighted agility stats
  const randomIndex = Math.floor(Math.random() * 2);
  const characters =
    randomIndex === 0
      ? currentAction.characters
      : [currentAction.characters[1], currentAction.characters[0]];

  const opponent1 = characters[0] as CharacterWithRelations;
  const opponent2 = characters[1] as CharacterWithRelations;
  const battleLog: BattleLog = {};

  calculateTotalDamage(opponent1, opponent2, battleLog);
  calculateTotalDamage(opponent2, opponent1, battleLog);

  await prisma.$transaction(async (tx) => {
    const updatedOpponent1 = await updateStats(opponent1, battleLog, tx);
    const updatedOpponent2 = await updateStats(opponent2, battleLog, tx);
    const updatedActions = await updateActions(currentAction, battleLog, tx);
    const updatedTile = await updateTile(currentAction.tileId, battleLog, tx);

    // TODO: update tile
    // const updatedTile = tx.tile.findUnique({
    //   where: {
    //     id: currentAction.tileId,
    //   },
    //   include: {
    //     actions: true,
    //     characters: true,
    //   },
    // });

    console.log(`### BATTLE LOG ###\nChar1 #${opponent1.id} - Char2 #${opponent2.id}\n`, battleLog);

    // Update frontend
    io.in(gameId).emit(SocketEvent.CHARACTER_UPDATE, { data: updatedOpponent1 });
    io.in(gameId).emit(SocketEvent.CHARACTER_UPDATE, { data: updatedOpponent2 });

    if (updatedTile) {
      io.in(gameId).emit(SocketEvent.TILE_UPDATE, { data: updatedTile });
    }

    updatedActions.forEach((action) => {
      io.in(gameId).emit(SocketEvent.ACTION_UPDATE, { data: action });
    });
  });
};

const updateTile = async (tileId: number, battleLog: BattleLog, tx: any) => {
  const isActionOver = Object.keys(battleLog).some(
    (key: any) => battleLog[key].isDefeated || false,
  );

  if (isActionOver) {
    return await tx.tile.update({
      where: {
        id: tileId,
      },
      data: {
        type: TileType.DEFEATED,
      },
    });
  }

  return null;
};

const updateActions = async (
  action: Action,
  battleLog: BattleLog,
  tx: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >,
) => {
  const history = (action.history as Prisma.JsonArray) || [];
  const round = (action.round as Prisma.JsonObject) || {};
  const isActionOver = Object.keys(battleLog).some(
    (key: any) => battleLog[key].isDefeated || false,
  );

  if (Object.keys(round).length > 0) {
    history.push(round);
  }

  const currentAction = await tx.action.update({
    where: {
      id: action.id,
    },
    data: {
      round: battleLog as Prisma.InputJsonValue,
      history,
      type: isActionOver ? ActionType.OVER : ActionType.PENDING,
    },
    include: {
      characters: {
        select: {
          id: true,
        },
      },
      tile: {
        select: {
          id: true,
        },
      },
    },
  });

  const updatedActions = [currentAction];

  // end all actions that might be related to this action characters - exclude current action
  if (isActionOver) {
    const { count } = await tx.action.updateMany({
      where: {
        id: {
          not: currentAction.id,
        },
        characters: {
          some: {
            id: {
              in: currentAction.characters.map((c) => c.id),
            },
          },
        },
      },
      data: {
        type: ActionType.OVER,
      },
    });

    if (count > 0) {
      const otherActions = await tx.action.findMany({
        where: {
          id: {
            not: currentAction.id,
          },
          characters: {
            some: {
              id: {
                in: currentAction.characters.map((c) => c.id),
              },
            },
          },
        },
        include: {
          characters: {
            select: {
              id: true,
            },
          },
          tile: {
            select: {
              id: true,
            },
          },
        },
      });

      updatedActions.push(...otherActions);
    }
  }

  return updatedActions;
};

const updateStats = async (
  { id, stats, isNpc }: CharacterWithRelations,
  battleLog: BattleLog,
  tx: Omit<
    PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
    '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
  >,
) => {
  const { totalDamage = 0, strengthLoss = 0, manaLoss = 0 } = battleLog[id];
  const updatedHitpoints = stats.hitpoints - totalDamage;
  const updatedStrength = stats.strength - strengthLoss;
  const updatedMana = stats.mana - manaLoss;

  const data: Prisma.StatsUncheckedUpdateInput = {
    hitpoints: getValueOrZero(updatedHitpoints),
    strength: getValueOrZero(updatedStrength),
    mana: getValueOrZero(updatedMana),
    version: {
      increment: 1,
    },
  };

  if (!isNpc) {
    const newExperience =
      stats.experience + Math.ceil(totalDamage / settings.attack.experienceDivider);

    data.experience = newExperience;
    data.level = levelByEp(newExperience);

    // next level reached - add some open stats points
    if (data.level > stats.level) {
      data.openStatsPoints = stats.openStatsPoints + settings.level.statsPointsByLevel;
    }
  }

  return await tx.character.update({
    where: {
      id,
    },
    data: {
      stats: {
        update: data,
      },
      version: {
        increment: 1,
      },
    },
    include: {
      action: true,
      stats: true,
      tile: true,
    },
  });
};

const calculateDamage = (character: CharacterWithRelations, battleLog: BattleLog): number => {
  const partialBattleLog: BattleLogProps = {};
  let strengthLoss = 0;
  let manaLoss = 0;

  const lootDamage = character.loot.reduce((sum: number, loot: Loot) => {
    const lootStats = getLootstats(loot);

    let damage = getRandomArbitrary(lootStats.damage.min, lootStats.damage.max);
    partialBattleLog.lootDamageDealt = damage;

    const isCriticalHit = getRandomWeightedBoolean(lootStats.criticalChance);
    partialBattleLog.isCriticalHit = isCriticalHit;

    if (isCriticalHit) {
      const criticalDamagePercentage = getRandomArbitrary(
        lootStats.criticalDamage.min,
        lootStats.criticalDamage.max,
      );
      partialBattleLog.criticalDamagePercentage = criticalDamagePercentage;

      damage *= criticalDamagePercentage;
    }

    strengthLoss += lootStats.strengthLoss;
    manaLoss += lootStats.manaLoss;

    return sum + damage;
  }, 0);

  const damageByStrength = character.stats.strength / settings.attack.strengthDivider;
  const totalDamage = lootDamage + damageByStrength;

  battleLog[character.id] = {
    ...battleLog[character.id],
    ...partialBattleLog,
    strengthDamageDealt: damageByStrength,
    totalDamage: totalDamage,
    strengthLoss,
    manaLoss,
  };

  return totalDamage;
};

const calculateDefensePercentage = (
  character: CharacterWithRelations,
  battleLog: BattleLog,
): number => {
  const totalDefense = character.loot.reduce((sum: number, loot: Loot) => {
    const lootStats = getLootstats(loot);
    const calculatedDefense = getRandomArbitrary(
      lootStats.protection.min,
      lootStats.protection.max,
    );

    return sum + calculatedDefense;
  }, 0);

  battleLog[character.id] = {
    ...battleLog[character.id],
    damageBlocked: totalDefense,
  };

  return totalDefense;
};
const calculateTotalDamage = (
  opponent1: CharacterWithRelations,
  opponent2: CharacterWithRelations,
  battleLog: BattleLog,
) => {
  // calculate damage from players
  const accumulatedDamage = calculateDamage(opponent1, battleLog);

  // calculate defense from enemy
  const accumulatedDefensePercentage = calculateDefensePercentage(opponent2, battleLog);

  // calculate total damage
  const totalDamage = accumulatedDamage * (1 - accumulatedDefensePercentage);

  // check if enemy is defeated
  battleLog[opponent2.id].isDefeated = totalDamage > opponent2.stats.hitpoints;

  return totalDamage;
};
