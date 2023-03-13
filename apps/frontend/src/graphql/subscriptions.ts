import { gql } from '@apollo/client';
import { CHARACTER_FIELDS, TILE_FIELDS, FIGHT_FIELDS } from './fragments';

export const UPDATE_GAME_SUBSCRIPTION = gql`
  subscription UpdateGameSubscription($gameId: String!) {
    updateGame(gameId: $gameId) {
      id
      stage
    }
  }
`;

export const UPDATE_PLAYER_SUBSCRIPTION = gql`
  ${CHARACTER_FIELDS}
  subscription UpdatePlayerSubscription($gameId: String!) {
    updatePlayer(gameId: $gameId) {
      ...CharacterFields
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

export const UPDATE_FIGHT_SUBSCRIPTION = gql`
  ${FIGHT_FIELDS}
  subscription UpdateFightSubscription($gameId: String!) {
    updateFight(gameId: $gameId) {
      ...FightFields
    }
  }
`;
