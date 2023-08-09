/**
 * Get calulated level for given EP
 */

export const levelByEp = (ep: number) => Math.floor(Math.sqrt((ep / 6 + 2.5) / 2.5));
export const epByLevel = (level: number) => 15 * Math.pow(level, 2) - 15;
