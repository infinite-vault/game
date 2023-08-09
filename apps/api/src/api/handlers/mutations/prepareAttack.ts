import { ActionType } from 'database';
import { getActionById } from '../../queries/getActionById';
import { prisma } from '../../../prisma/prismaClient';
import { io } from '../../..';
import { SocketEvent } from 'types';
import { actionQueue } from '../../../bull/bull';
import { settings } from '../../../config/settings';
import { Request, Response } from 'express';

export const prepareAttack = async (req: Request, res: Response) => {
  try {
    addAttackToQueue(req);
    res.sendStatus(200);
  } catch (err) {
    res.status(400).json({ error: 'SERVER_ERROR' });
  }
};

const addAttackToQueue = async (req: Request) => {
  const actionId = parseInt(req.query.actionId as string, 10);
  const gameId = req.query.gameId as string;

  // TODO: check user id
  console.log('TODO: security check', { actionId, gameId });

  const currentAction = await getActionById(actionId as unknown as number);

  if (currentAction?.type !== ActionType.PENDING) {
    throw new Error('ACTION_NOT_PENDING');
  }

  const action = await prisma.action.update({
    where: {
      id: actionId,
    },
    data: {
      type: ActionType.DRAMA,
    },
  });

  io.in(gameId as string).emit(SocketEvent.ACTION_UPDATE, { data: action });

  await actionQueue.add(
    `delayed-action-${actionId}`,
    { gameId, actionId },
    { delay: settings.attack.delayMs },
  );
};
