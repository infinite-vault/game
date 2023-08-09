import { TileType } from 'database';
import { EnemyConfig, enemies } from './enemies';
import { Range, WeightedItem } from 'types';

const defaultTileBackgrounds = ['tile/empty1.png', 'tile/empty2.png'];

export interface TileConfig {
  type: TileType;
  weight: number;
  distance: Range;
  backgrounds: string[];
  enemies?: WeightedItem<EnemyConfig>[];
}

export const tiles: TileConfig[] = [
  {
    type: TileType.START,
    weight: 0,
    distance: {
      min: 0,
      max: 0,
    },
    backgrounds: ['tile/start.png'],
  },
  {
    type: TileType.EMPTY,
    weight: 60,
    distance: {
      min: 0,
      max: Infinity,
    },
    backgrounds: defaultTileBackgrounds,
  },
  {
    type: TileType.ENEMY,
    weight: 40,
    distance: {
      min: 2,
      max: 8,
    },
    backgrounds: defaultTileBackgrounds,
    enemies: [{ item: enemies['monster-1'], weight: 100 }],
  },
  {
    type: TileType.ENEMY,
    weight: 30,
    distance: {
      min: 6,
      max: 14,
    },
    backgrounds: defaultTileBackgrounds,
    enemies: [
      { item: enemies['monster-1'], weight: 10 },
      { item: enemies['monster-2'], weight: 90 },
    ],
  },
  {
    type: TileType.PORTAL,
    weight: 5,
    distance: {
      min: 4,
      max: Infinity,
    },
    backgrounds: defaultTileBackgrounds,
  },
  {
    type: TileType.SHOP,
    weight: 5,
    distance: {
      min: 4,
      max: Infinity,
    },
    backgrounds: defaultTileBackgrounds,
  },
];
