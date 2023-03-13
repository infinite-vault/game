import { Stats } from './Stats';

export interface Character {
  id: number;
  userId: string;
  name: string;
  status: string;
  x: number;
  y: number;
  stepsMax: number;
  stepsDone: number;
  nextAction: string;
  stats: Stats;
}
