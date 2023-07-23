import { Queue, Worker } from 'bullmq';
import { startFight } from '../api/handlers/mutations/startFight';

enum QueueNames {
  ACTIONS = 'actions',
}

// TODO: Add redis connection explicitly
export const actionQueue = new Queue(QueueNames.ACTIONS);
export const actionWorker = new Worker(QueueNames.ACTIONS, async (job) => {
  console.log('start fight', job.data);
  await startFight(job.data);
});

// actionWorker.on('completed', (job) => {
//   console.log(`${job.id} has completed!`);
// });

// actionWorker.on('failed', (job, err) => {
//   console.log(`${job?.id} has failed with ${err.message}`);
// });

// await actionQueue.add('myJobName', { id: gameId }, { delay: 10000 });
