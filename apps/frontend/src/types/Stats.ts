import { Character } from './Character';
import { Fight } from './Fight';

export interface Stats {
  id: number;

  fight: Fight;
  fightId: number;
  character: Character;
  characterId: number;

  level: number;
  ep: number;

  strength: number;
  wisdom: number;
  stamina: number;

  hp: number;
  hpMax: number;
  mana: number;
  manaMax: number;
  endurance: number;
  enduranceMax: number;
}
