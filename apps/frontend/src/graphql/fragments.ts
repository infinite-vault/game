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

export const TILE_FIELDS = gql`
  fragment TileFields on Tile {
    id

    type
    x
    y
  }
`;

export const ACTION_FIELDS = gql`
  ${TILE_FIELDS}
  fragment ActionFields on Action {
    id
    gameId
    type

    tile {
      ...TileFields
    }
    characters {
      id
    }

    round
    diff
    history

    isOver
    isDeleted
  }
`;

export const CHARACTER_FIELDS = gql`
  ${STATS_FIELDS}
  ${TILE_FIELDS}
  fragment CharacterFields on Character {
    id
    userId

    actionId
    action {
      id
    }
    tileId
    tile {
      ...TileFields
    }

    name
    avatar
    stats {
      ...StatsFields
    }
    connection
    nextAction

    isNpc
    isDefeated
  }
`;

export const GAME_FIELDS = gql`
  fragment GameFields on Game {
    id
    name
  }
`;
