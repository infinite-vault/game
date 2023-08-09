import { tiles } from './tiles';
import { lootConfig } from './loot';

export const settings = {
  theme: {
    name: 'default',
  },
  init: {
    totalStatsPoints: 10,
  },
  attack: {
    diceMax: 20,
    delayMs: 5000,
    strengthDivider: 13,
    experienceDivider: 6,
  },
  level: {
    statsPointsByLevel: 10,
  },
  refreshRates: {
    hitpoints: 30 * 1000,
    strength: 30 * 1000,
    mana: 30 * 1000,
    steps: 20 * 1000,
  },
  tiles,
  loot: lootConfig,
};

export type Settings = typeof settings;
