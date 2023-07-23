import { TileType } from 'database';

const defaultTileBackgrounds = ['tile/empty1.png', 'tile/empty2.png'];

export const settings = {
  theme: {
    name: 'default',
  },
  attack: {
    diceMax: 20,
    delayMs: 5000,
  },
  tiles: [
    {
      type: TileType.START,
      weight: 0,
      minDistance: 0,
      maxDistance: 0,
      backgrounds: ['tile/start.png'],
    },
    {
      type: TileType.EMPTY,
      weight: 60,
      minDistance: 1,
      backgrounds: defaultTileBackgrounds,
    },
    {
      type: TileType.ENEMY,
      enemy: {
        name: 'Monster #1',
        stats: {
          levelMin: 3,
          levelMax: 5,
          hpMin: 10,
          hpMax: 15,
          strengthMin: 5,
          strengthMax: 8,
        },
      },
      weight: 40,
      minDistance: 2,
      maxDistance: 10,
      backgrounds: defaultTileBackgrounds,
    },
    {
      type: TileType.ENEMY,
      enemy: {
        name: 'Monster #2',
        stats: {
          levelMin: 5,
          levelMax: 8,
          hpMin: 15,
          hpMax: 19,
          strengthMin: 7,
          strengthMax: 12,
        },
      },
      weight: 30,
      minDistance: 6,
      maxDistance: 15,
      backgrounds: defaultTileBackgrounds,
    },
    {
      type: TileType.PORTAL,
      name: 'Portal',
      weight: 5,
      minDistance: 5,
      backgrounds: defaultTileBackgrounds,
    },
  ],
};

export type Settings = typeof settings;
