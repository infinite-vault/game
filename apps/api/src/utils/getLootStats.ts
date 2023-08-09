import { Loot } from 'database';
import { lootConfig } from '../config/loot';

export const getLootstats = (loot: Loot) => lootConfig[loot.key].level[loot.level];
