import { Stats } from './Stats';
import { Tile } from './Tile';

export interface Enemy {
  id: number;

  stats: Stats;
  tile: Tile;

  name: string;
  isDefeated: boolean;
  history: string;
}
