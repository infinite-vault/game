/**
 * Get calulated level for given EP
 */
export const levelByEp = (ep: number) => Math.floor(Math.sqrt((ep + 2.5) / 2.5));
