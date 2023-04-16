import { gql } from '@apollo/client';
import { GAME_FIELDS, CHARACTER_FIELDS, TILE_FIELDS, ACTION_FIELDS } from './fragments';

export const GET_USER = gql`
  query GetUser($email: String) {
    user(email: $email) {
      id
      email
    }
  }
`;

export const GET_LOGOUT = gql`
  query Logout {
    logout
  }
`;

export const GET_CHARACTERS = gql`
  query GetCharacters {
    characters {
      id
      name
    }
  }
`;

export const GET_FREE_CHARACTERS = gql`
  query GetFreeCharacters {
    freeCharacters {
      id
      name
    }
  }
`;

export const GET_GAMES = gql`
  ${CHARACTER_FIELDS}
  ${GAME_FIELDS}
  query GetGames {
    games {
      ...GameFields
      characters {
        ...CharacterFields
      }
    }
  }
`;

export const GET_GAME = gql`
  ${GAME_FIELDS}
  query GetGame($gameId: String!) {
    game(gameId: $gameId) {
      ...GameFields
      characters {
        id
      }
    }
  }
`;

export const GET_PLAYERS = gql`
  ${CHARACTER_FIELDS}
  query GetPlayers($gameId: String!) {
    players(gameId: $gameId) {
      ...CharacterFields
    }
  }
`;

export const GET_TILES = gql`
  ${TILE_FIELDS}
  query GetTiles($gameId: String!) {
    tiles(gameId: $gameId) {
      ...TileFields
    }
  }
`;

export const GET_ACTIONS = gql`
  ${ACTION_FIELDS}
  query GetActions($gameId: String!) {
    actions(gameId: $gameId) {
      ...ActionFields
    }
  }
`;
