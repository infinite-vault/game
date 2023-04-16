import { gql } from '@apollo/client';
import { TILE_FIELDS, ACTION_FIELDS } from './fragments';

export const UPDATE_GAME_SUBSCRIPTION = gql`
  subscription UpdateGameSubscription($gameId: String!) {
    updateGame(gameId: $gameId) {
      id
      name
    }
  }
`;

export const UPDATE_PLAYER_SUBSCRIPTION = gql`
  ${TILE_FIELDS}
  subscription UpdatePlayerSubscription($gameId: String!) {
    updatePlayer(gameId: $gameId) {
      id
      connection
      tileId
      tile {
        ...TileFields
      }
    }
  }
`;

export const UPDATE_TILE_SUBSCRIPTION = gql`
  ${TILE_FIELDS}
  subscription UpdateTileSubscription($gameId: String!) {
    updateTile(gameId: $gameId) {
      ...TileFields
    }
  }
`;

export const UPDATE_ACTION_SUBSCRIPTION = gql`
  ${ACTION_FIELDS}
  subscription UpdateActionSubscription($gameId: String!) {
    updateAction(gameId: $gameId) {
      ...ActionFields
    }
  }
`;

export const FOO_SUBSCRIPTION = gql`
  subscription FooSubscription($gameId: String!) {
    updateFoo(gameId: $gameId) {
      id
    }
  }
`;

export const TRIGGER_REFETCH_SUBSCRIPTION = gql`
  subscription TriggerRefetchSubscription($gameId: String!) {
    triggerRefetch(gameId: $gameId) {
      query
    }
  }
`;
