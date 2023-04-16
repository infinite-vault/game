import { Queue, Worker } from 'bullmq';

export const myQueue = new Queue('stats');

export const worker = new Worker('stats', async (job) => {
  console.log(job.data);
});

worker.on('completed', (job) => {
  console.log(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`);
});

// await myQueue.add('myJobName', { id: gameId }, { delay: 10000 });
