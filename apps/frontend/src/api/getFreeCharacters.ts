import axios from 'axios';
import { ApiPath } from 'types';

export const getFreeCharacters = () => axios.get(ApiPath.FREE_CHARACTERS).then(({ data }) => data);
