import { atomWithDefault } from 'jotai/utils';
import { socket } from '../sockets';

export const myCharactersAtom = atomWithDefault<string[]>(() => {
  // get all characters from REST API
  return [];
});
