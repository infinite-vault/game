import { gql } from '@apollo/client';

export const STATS_FIELDS = gql`
  fragment StatsFields on Stats {
    id
    level
    ep
    strength
    wisdom
    stamina

    hp
    hpMax
    mana
    manaMax
    endurance
    enduranceMax
    stepsDone
    stepsMax
  }
`;

export const CHARACTER_FIELDS = gql`
  ${STATS_FIELDS}
  fragment CharacterFields on Character {
    id
    userId
    name
    x
    y
    stats {
      ...StatsFields
    }
    status
    nextAction
  }
`;

export const TILE_FIELDS = gql`
  fragment TileFields on Tile {
    id
    x
    y
    type
  }
`;

export const ENEMY_FIELDS = gql`
  ${STATS_FIELDS}
  ${TILE_FIELDS}
  fragment EnemyFields on Enemy {
    id
    stats {
      ...StatsFields
    }
    tile {
      ...TileFields
    }

    name
    isDefeated
    history
  }
`;

export const FIGHT_FIELDS = gql`
  ${TILE_FIELDS}
  ${ENEMY_FIELDS}
  fragment FightFields on Fight {
    id
    gameId
    enemy {
      ...EnemyFields
    }
    characterId
    tile {
      ...TileFields
    }

    attack
    diff
    history
    isOver
    isPending
    isDeleted
  }
`;

export const GAME_FIELDS = gql`
  fragment GameFields on Game {
    id
    name
  }
`;
