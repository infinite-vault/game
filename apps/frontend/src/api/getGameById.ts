import axios from 'axios';
import { ApiPath } from 'types';

export const getGameById = (gameId: string) =>
  axios.get(ApiPath.GAME, { params: { gameId } }).then(({ data }) => data);
