import { Range, WeightedItem } from 'types';
import { Loot, lootConfig } from './loot';

export interface EnemyConfig {
  name: string;
  // avatar: string;
  level: Range;
  hitpoints: Range;
  strength: Range;
  loot: WeightedItem<Loot>[];
}

export interface Enemies {
  [key: string]: EnemyConfig;
}

export const enemies: Enemies = {
  'monster-1': {
    name: 'Monster #1',
    level: { min: 1, max: 3 },
    hitpoints: { min: 20, max: 40 },
    strength: { min: 20, max: 40 },
    loot: [
      { item: lootConfig['sword-default'], weight: 80 },
      { item: lootConfig['arrow-default'], weight: 20 },
    ],
  },
  'monster-2': {
    name: 'Monster #2',
    level: { min: 3, max: 5 },
    hitpoints: { min: 40, max: 60 },
    strength: { min: 40, max: 60 },
    loot: [
      { item: lootConfig['sword-default'], weight: 60 },
      { item: lootConfig['arrow-default'], weight: 40 },
    ],
  },
};
