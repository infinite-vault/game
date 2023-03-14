/**
 * Get damage done by given dice roll relative to players strength
 */
export const damageByStrength = (strength: number, dicePercentage: number) =>
  Math.round(strength * dicePercentage + strength * 0.25);
