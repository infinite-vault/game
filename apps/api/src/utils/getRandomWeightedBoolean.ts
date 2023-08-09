export const getRandomWeightedBoolean = (weight: number): boolean => {
  if (weight < 0 || weight > 1) {
    return false;
  }

  return Math.random() < weight;
};
