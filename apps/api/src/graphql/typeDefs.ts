export const typeDefs = `#graphql
  scalar Json

  type User {
    id: String
    email: String
    characters: [Character]
  }

  type Game {
    id: String
    characters: [Character]
    tiles: [Tile]
    fights: [Fight]
    name: String
    stage: String
  }

  type Character {
    id: Int
    user: User
    userId: String
    game: Game
    gameId: String
    fights: [Fight!]!
    stats: Stats

    name: String
    status: String
    x: Int
    y: Int
    nextAction: String
  }

  type Tile {
    id: Int
    game: Game
    gameId: String
    enemy: Enemy
    enemyId: Int
    fight: Fight
    fightId: Int

    x: Int
    y: Int
    type: String    
  }

  type Fight {
    id: Int
    game: Game
    gameId: String
    enemy: Enemy
    enemyId: Int
    character: Character
    characterId: Int
    tile: Tile

    attack: Json
    diff: Json
    history: Json
    isOver: Boolean
    isPending: Boolean
    isDeleted: Boolean
  }

  type Enemy {
    id: Int
    fights: [Fight!]!
    stats: Stats
    tile: Tile

    name: String
    isDefeated: Boolean
    diff: Json
    history: Json
  }

  type Stats {
    id: Int
    character: Character
    characterId: Int
    enemy: Enemy
    enemyId: Int

    level: Int
    ep: Int

    strength: Int
    wisdom: Int
    stamina: Int

    hp: Int
    hpMax: Int
    mana: Int
    manaMax: Int
    endurance: Int
    enduranceMax: Int
    stepsDone: Int
    stepsMax: Int
  }

  type Query {
    game(gameId: String!): Game!
    games: [Game!]!
    characters: [Character!]!
    freeCharacters: [Character!]!
    players(gameId: String!): [Character!]!
    tiles(gameId: String!): [Tile!]!
    fights(gameId: String!): [Fight!]!
  }  

  type Mutation {
    addCharacter(name: String!): Character!
    addCharacterToNewGame(characterId: Int!, name: String!): Game!
    addCharacterToExistingGame(characterId: Int!, code: String!): Game!
    endGame(gameId: String!): Boolean
    setGameState(gameId: String!, status: String!): Boolean
    moveTo(gameId: String!, x: Int!, y: Int!): Boolean
    attack(fightId: Int!): Boolean
  }

  type Subscription {
    updateGame(gameId: String!): Game!
    updatePlayer(gameId: String!): Character!
    updateTile(gameId: String!): Tile!
    updateFight(gameId: String!): Fight!
  }
`;
