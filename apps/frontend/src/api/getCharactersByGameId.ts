import axios from 'axios';
import { ApiPath } from 'types';

export const getCharactersByGameId = (gameId: string) =>
  axios.get(ApiPath.GET_CHARACTERS_BY_GAME_ID, { params: { gameId } }).then(({ data }) => data);
