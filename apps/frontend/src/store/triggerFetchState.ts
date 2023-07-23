import { atomWithDefault } from 'jotai/utils';

export const triggerFetchAtom = atomWithDefault(() => Date.now());
