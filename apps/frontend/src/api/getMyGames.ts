import axios from 'axios';
import { ApiPath } from 'types';

export const getMyGames = () => axios.get(ApiPath.MY_GAMES).then(({ data }) => data);
