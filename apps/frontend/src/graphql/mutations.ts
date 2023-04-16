import { gql } from '@apollo/client';

export const ADD_CHARACTER = gql`
  mutation AddCharacter($name: String!) {
    addCharacter(name: $name) {
      id
      name
    }
  }
`;

export const ADD_CHARACTER_TO_NEW_GAME = gql`
  mutation AddCharacterToNewGame($characterId: Int!, $name: String!) {
    addCharacterToNewGame(characterId: $characterId, name: $name) {
      id
      name
    }
  }
`;

export const ADD_CHARACTER_TO_EXISTING_GAME = gql`
  mutation AddCharacterToExistingGame($characterId: Int!, $code: String!) {
    addCharacterToExistingGame(characterId: $characterId, code: $code) {
      id
      name
    }
  }
`;

export const START_GAME = gql`
  mutation StartGame($gameId: String!) {
    startGame(gameId: $gameId) {
      id
    }
  }
`;

export const END_GAME = gql`
  mutation EndGame($gameId: String!) {
    endGame(gameId: $gameId)
  }
`;

export const SET_GAME_STATE = gql`
  mutation SetGameState($gameId: String!, $connection: String!) {
    setGameState(gameId: $gameId, connection: $connection)
  }
`;

export const MOVE_TO = gql`
  mutation MoveTo($gameId: String!, $x: Int!, $y: Int!) {
    moveTo(gameId: $gameId, x: $x, y: $y)
  }
`;

export const ATTACK = gql`
  mutation Attack($fightId: Int!) {
    attack(fightId: $fightId)
  }
`;
