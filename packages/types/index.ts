export enum SocketEvent {
  JOIN_ROOM = 'JOIN_ROOM',
  LEAVE_ROOM = 'LEAVE_ROOM',
  CHARACTER_UPDATE = 'CHARACTER_UPDATE',
  CHARACTER_FULL_UPDATE = 'CHARACTER_FULL_UPDATE',
  TILE_UPDATE = 'TILE_UPDATE',
  TILE_FULL_UPDATE = 'TILE_FULL_UPDATE',
  ACTION_UPDATE = 'ACTION_UPDATE',
  ACTION_FULL_UPDATE = 'ACTION_FULL_UPDATE',
}

export enum ApiPath {
  LOGIN = '/login',
  LOGOUT = '/logout',
  FREE_CHARACTERS = '/free-characters',
  ADD_CHARACTER = '/add-character',
  ADD_CHARACTER_TO_NEW_GAME = '/add-character-to-new-game',
  ADD_CHARACTER_TO_EXISTING_GAME = '/add-character-to-existing-game',
  MY_GAMES = '/my-games',
  GAME = '/game',
  GET_CHARACTERS_BY_GAME_ID = '/get-characters-by-game-id',
  GET_TILES_BY_GAME_ID = '/get-tiles-by-game-id',
  GET_PLAYERS_BY_GAME_ID = '/get-players-by-game-id',
  SET_CHARACTER_CONNECTION = '/set-character-connection',
  MOVE_TO_TILE = '/move-to-tile',
  GET_ACTIONS_BY_GAME_ID = '/get-actions-by-game-id',
  PREPARE_ATTACK = '/prepare-attack',
}

export type Range = {
  min: number;
  max: number;
};

export interface WeightedItem<T> {
  item: T;
  weight: number;
}

export interface BattleLogProps {
  lootDamageDealt?: number;
  strengthDamageDealt?: number;
  criticalDamagePercentage?: number;
  totalDamage?: number;
  damageBlocked?: number;
  isCriticalHit?: boolean;
  strengthLoss?: number;
  manaLoss?: number;
  isDefeated?: boolean;
}

export interface BattleLog {
  [key: number]: BattleLogProps;
}
