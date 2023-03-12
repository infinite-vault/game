import express, { Request, Response } from 'express';
import { PrismaClient } from 'database';

const prisma = new PrismaClient();
const app = express();
const port = 4000;

app.get('/', (req: Request, res: Response) => {
  console.log('Hello World');
  res.send('Hello World!');
});

app.get('/foo', (req: Request, res: Response) => {
  console.log('bar');
  res.send('bar');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

(async () => {
  const users = await prisma.user.findMany();
  console.log('users', users);
})();
