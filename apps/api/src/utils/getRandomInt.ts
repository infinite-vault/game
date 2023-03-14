export const getRandomInt = (from: number, to: number) => {
  const min = Math.ceil(from);
  const max = Math.floor(to);
  return Math.floor(Math.random() * (max - min) + min);
};
