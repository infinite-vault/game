import { Character } from './Character';
import { Enemy } from './Enemy';
import { Game } from './Game';
import { Tile } from './Tile';

interface FightResult {
  dice: number;
  diceMax: number;
  damage: number;
  isCritical: boolean;
}

export interface FightResults {
  me: FightResult;
  enemy: FightResult;
}

export interface Fight {
  id: number;
  game: Game;
  gameId: string;
  character: Character;
  characterId: number;
  enemy: Enemy;
  enemyId: number;
  tile: Tile;

  attack: JSON;
  diff?: JSON;
  history: FightResults[];
  isOver: boolean;
  isPending: boolean;
  isDeleted: boolean;
}
