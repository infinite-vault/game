import { Fight } from './Fight';
import { Game } from './Game';

export interface Tile {
  id: number;
  x: number;
  y: number;
  type: string;

  game: Game;
  fight: Fight;
}
