import { TILE_LENGTH, TILE_LENGTH_HALF } from '../pages/Game/logic/TileLogic';

export const getCoordinate = (coordinate: number) => coordinate * TILE_LENGTH - TILE_LENGTH_HALF;
