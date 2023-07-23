import axios from 'axios';
import { ApiPath } from 'types';

export const getPlayersByGameId = (gameId: string) =>
  axios.get(ApiPath.GET_PLAYERS_BY_GAME_ID, { params: { gameId } }).then(({ data }) => data);
