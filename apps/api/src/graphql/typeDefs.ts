import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar JSON
  scalar DateTime

  type User {
    id: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Auth {
    id: String
    userId: String
    email: String
    password: String
    createdAt: DateTime
    updatedAt: DateTime
  }

  type Game {
    id: String
    name: String

    characters: [Character!]!
    tiles: [Tile!]!
    actions: [Action!]!

    createdAt: DateTime
    updatedAt: DateTime
  }

  type Character {
    id: Int
    user: User
    userId: String
    game: Game
    gameId: String
    action: Action
    actionId: Int
    tile: Tile
    tileId: Int

    name: String
    avatar: String
    stats: Stats
    connection: String
    nextAction: String

    isNpc: Boolean
    isDefeated: Boolean

    createdAt: DateTime
    updatedAt: DateTime
  }

  type Tile {
    id: Int
    game: Game
    gameId: String

    characters: [Character!]!
    actions: [Action!]!

    type: String
    x: Int
    y: Int

    createdAt: DateTime
    updatedAt: DateTime
  }

  type Action {
    id: Int
    game: Game
    gameId: String
    tile: Tile
    tileId: Int

    characters: [Character!]!
    type: String

    round: JSON
    diff: JSON
    history: JSON

    isOver: Boolean
    isDeleted: Boolean

    createdAt: DateTime
    updatedAt: DateTime
  }

  type Stats {
    id: Int
    character: Character
    characterId: Int

    level: Int
    ep: Int
    strength: Int
    wisdom: Int
    stamina: Int
    agility: Int
    luck: Int
    stealth: Int
    vision: Int

    hp: Int
    hpMax: Int
    mana: Int
    manaMax: Int
    endurance: Int
    enduranceMax: Int

    stepsDone: Int
    stepsMax: Int

    createdAt: DateTime
    updatedAt: DateTime
  }

  type Query {
    game(gameId: String!): Game!
    games: [Game!]!
    characters: [Character!]!
    freeCharacters: [Character!]!
    players(gameId: String!): [Character!]!
    tiles(gameId: String!): [Tile!]!
    actions(gameId: String!): [Action!]!
  }

  type Mutation {
    addCharacter(name: String!): Character!
    addCharacterToNewGame(characterId: Int!, name: String!): Game!
    addCharacterToExistingGame(characterId: Int!, code: String!): Game!
    endGame(gameId: String!): Boolean
    setGameState(gameId: String!, connection: String!): Boolean
    moveTo(gameId: String!, x: Int!, y: Int!): Boolean
    attack(actionId: Int!): Boolean
  }

  type Subscription {
    updateFoo(gameId: String!): User!
    updateGame(gameId: String!): Game!
    updatePlayer(gameId: String!): Character!
    updateTile(gameId: String!): Tile!
    updateAction(gameId: String!): Action!
  }
`;
