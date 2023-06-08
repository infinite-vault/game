import { settings } from './settings';

// TODO: rebuild this to reflect tile position, player stats, etc.
export function pickRandomTileType(): string | null {
  const { tiles } = settings;
  const totalWeight = tiles.reduce((sum, tile) => sum + tile.weight, 0);
  const randomNumber = Math.random() * totalWeight;

  let accumulatedWeight = 0;
  for (const tile of tiles) {
    accumulatedWeight += tile.weight;

    if (randomNumber < accumulatedWeight) {
      return tile.name;
    }
  }

  return 'EMPTY';
}
