interface TileType {
  type: string;
  multiply?: number;
}

const TILE_CONFIG: TileType[] = [
  { type: 'empty', multiply: 10 },
  { type: 'monster', multiply: 10 },
  { type: 'shop' },
  { type: 'portal' },
  { type: 'spa' },
];
const WEIGHTED_TYPES: string[] = [];

TILE_CONFIG.forEach((tile) => {
  const multiply = tile.multiply || 1;
  for (let index = 0; index < multiply; index++) {
    WEIGHTED_TYPES.push(tile.type);
  }
});

export const getRandomTileType = () => WEIGHTED_TYPES[Math.floor(Math.random() * WEIGHTED_TYPES.length)];
