import axios from 'axios';
import { ApiPath } from 'types';

export const getTilesByGameId = (gameId: string) =>
  axios.get(ApiPath.GET_TILES_BY_GAME_ID, { params: { gameId } }).then(({ data }) => data);
