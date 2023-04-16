export const settings = {
  attack: {
    diceMax: 20,
    delay: 3500,
  },
  tiles: {
    EMPTY: {
      name: 'Empty',
      color: '#fff',
      boost: 12,
      images: ['tile/empty1.png', 'tile/empty2.png'],
    },
    MONSTER: {
      name: 'Monster',
      color: '#fff',
      boost: 10,
      images: ['tile/empty1.png', 'tile/empty2.png'],
    },
    PORTAL: {
      name: 'Monster',
      color: '#fff',
      boost: 1,
      images: ['tile/empty1.png', 'tile/empty2.png'],
    },
  },
};

export type Settings = typeof settings;
