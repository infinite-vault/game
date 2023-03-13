import { isEqual } from 'lodash';
import { Stats } from '../../../types/Stats';

export interface StatsDiff {
  ep?: number;
  hp?: number;
}

const getObjectDiff = (obj1: any, obj2: any) => {
  return Object.keys(obj1).reduce((result, key) => {
    if (!Object.prototype.hasOwnProperty.call(obj2, key)) {
      result.push(key);
    } else if (isEqual(obj1[key], obj2[key])) {
      const resultKeyIndex = result.indexOf(key);
      result.splice(resultKeyIndex, 1);
    }

    return result;
  }, Object.keys(obj2));
};

export const getStatsDiff = (oldStats: Stats, newStats: Stats) => {
  const diff: StatsDiff = {};

  if (oldStats.ep !== newStats.ep) {
    diff.ep = newStats.ep - oldStats.ep;
  }

  console.log('objDiff', JSON.stringify(getObjectDiff(oldStats, newStats)), diff, oldStats, newStats);

  return diff;
};
