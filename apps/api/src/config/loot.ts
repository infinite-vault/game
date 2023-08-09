import { Range } from 'types';

export enum AttackType {
  STEAL = 'steal',
  ARROW = 'arrow',
  SPELL = 'spell',
}

export interface Loot {
  attackTypes: AttackType[];
  defenseTypes: AttackType[];
  permanent: boolean;
  minPlayerLevel: number;
  level: {
    [key: number]: {
      damage: Range;
      protection: Range;
      strengthLoss: number;
      manaLoss: number;
      criticalChance: number;
      criticalDamage: Range;
    };
  };
}

type LootItem = { [key: string]: Loot };

export const lootConfig: LootItem = {
  'sword-default': {
    attackTypes: [AttackType.STEAL],
    defenseTypes: [AttackType.STEAL],

    permanent: true,
    minPlayerLevel: 1,

    level: {
      1: {
        damage: {
          min: 10,
          max: 15,
        },
        protection: {
          min: 0.1,
          max: 0.15,
        },
        criticalChance: 0.1,
        criticalDamage: {
          min: 1.15,
          max: 1.3,
        },

        strengthLoss: 0.5,
        manaLoss: 0,
      },
      2: {
        damage: {
          min: 12,
          max: 17,
        },
        protection: {
          min: 0.1,
          max: 0.15,
        },
        criticalChance: 0.12,
        criticalDamage: {
          min: 1.15,
          max: 1.3,
        },

        strengthLoss: 0.6,
        manaLoss: 0,
      },
    },
  },
  'arrow-default': {
    attackTypes: [AttackType.STEAL],
    defenseTypes: [],

    permanent: true,
    minPlayerLevel: 1,

    level: {
      1: {
        damage: {
          min: 8,
          max: 17,
        },
        protection: {
          min: 0,
          max: 0,
        },
        criticalChance: 0.15,
        criticalDamage: {
          min: 1.15,
          max: 1.3,
        },

        strengthLoss: 0.5,
        manaLoss: 0,
      },
    },
  },
  'shield-default': {
    attackTypes: [],
    defenseTypes: [AttackType.STEAL, AttackType.ARROW],

    permanent: true,
    minPlayerLevel: 1,

    level: {
      1: {
        damage: {
          min: 0,
          max: 0,
        },
        protection: {
          min: 0.2,
          max: 0.4,
        },
        criticalChance: 0,
        criticalDamage: {
          min: 1,
          max: 1,
        },

        strengthLoss: 0.4,
        manaLoss: 0,
      },
    },
  },
  'fire-spell-default': {
    attackTypes: [AttackType.SPELL],
    defenseTypes: [],

    permanent: true,
    minPlayerLevel: 1,

    level: {
      1: {
        damage: {
          min: 8,
          max: 17,
        },
        protection: {
          min: 0,
          max: 0,
        },
        criticalChance: 0.1,
        criticalDamage: {
          min: 1.15,
          max: 1.3,
        },

        strengthLoss: 0,
        manaLoss: 0.5,
      },
    },
  },
  'protection-spell-default': {
    attackTypes: [],
    defenseTypes: [AttackType.STEAL, AttackType.ARROW, AttackType.SPELL],

    permanent: true,
    minPlayerLevel: 1,

    level: {
      1: {
        damage: {
          min: 0,
          max: 0,
        },
        protection: {
          min: 5,
          max: 8,
        },
        criticalChance: 0,
        criticalDamage: {
          min: 1,
          max: 1,
        },

        strengthLoss: 0,
        manaLoss: 0.5,
      },
    },
  },
};
