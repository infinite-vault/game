import { WeightedItem } from 'types';
import { getRandomInt } from './getRandomInt';

export function getRandomWeightedItem<T>(items: WeightedItem<T>[]): T {
  if (!items?.length) {
    throw new Error('no item provided');
  }

  if (items.length === 1) {
    return items[0].item;
  }

  const weightsSum = items.reduce((sum, item) => sum + item.weight, 0);
  const randomWeight = getRandomInt(0, weightsSum);

  let currentWeight = 0;
  const chosenItem = items.find((item) => {
    currentWeight += item.weight;
    return currentWeight >= randomWeight;
  });

  if (!chosenItem) {
    throw new Error('no item found');
  }

  return chosenItem?.item;
}
