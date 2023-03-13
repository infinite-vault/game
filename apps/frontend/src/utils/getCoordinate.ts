import { TILE_LENGTH, TILE_LENGTH_HALF } from '../components/Game/tiles/Tiles';

export const getCoordinate = (coordinate: number) => coordinate * TILE_LENGTH - TILE_LENGTH_HALF;
