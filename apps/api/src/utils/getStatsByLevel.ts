import { getRandomInt } from './getRandomInt';

export const getStatsByLevel = (level = 1) => {
  console.log('getStatsByLevel', level);

  // TODO: add useful calculation here ;)
  const hp = getRandomInt(6 + level, 10 + level);
  const mana = getRandomInt(3 + level, 6 + level);
  const endurance = getRandomInt(10 + level, 20 + level);
  const strength = getRandomInt(5 + level, 7 + level);
  const wisdom = getRandomInt(1 + level, 2 + level);
  const stamina = getRandomInt(6 + level, 8 + level);

  return {
    strength,
    wisdom,
    stamina,

    hp,
    hpMax: hp,
    mana,
    manaMax: mana,
    endurance,
    enduranceMax: endurance,
    stepsDone: 0,
    stepsMax: 5,
  };
};
