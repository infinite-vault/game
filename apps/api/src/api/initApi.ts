import { Express, NextFunction, Request, Response } from 'express';
import { login } from './handlers/queries/login';
import { logout } from './handlers/queries/logout';
import { ApiPath } from 'types';
import { freeCharacters } from './handlers/queries/freeCharacters';
import { isAuthenticated } from './middleware/isAuthenticated';
import { addCharacter } from './handlers/queries/addCharacter';
import { myGames } from './handlers/queries/myGames';
import { addCharacterToNewGame } from './handlers/queries/addCharacterToNewGame';
import { addCharacterToExistingGame } from './handlers/queries/addCharacterToExistingGame';
import { game } from './handlers/queries/game';
import { getCharactersByGameId } from './handlers/queries/getCharactersByGameId';
import { getTilesByGameId } from './handlers/queries/getTilesByGameId';
import { moveToTile } from './handlers/queries/moveToTile';
import { getActionsByGameId } from './handlers/queries/getActionsByGameId';
import { prepareAttack } from './handlers/mutations/prepareAttack';

export const initApi = (app: Express) => {
  // Auth
  app.post(ApiPath.LOGIN, login);
  app.get(ApiPath.LOGOUT, logout);

  // Dashboard
  app.get(ApiPath.FREE_CHARACTERS, isAuthenticated, freeCharacters);
  app.get(ApiPath.MY_GAMES, isAuthenticated, myGames);

  app.post(ApiPath.ADD_CHARACTER, isAuthenticated, addCharacter);
  app.post(ApiPath.ADD_CHARACTER_TO_NEW_GAME, isAuthenticated, addCharacterToNewGame);
  app.post(ApiPath.ADD_CHARACTER_TO_EXISTING_GAME, isAuthenticated, addCharacterToExistingGame);

  // Game
  app.get(ApiPath.GAME, isAuthenticated, game);

  app.get(ApiPath.GET_CHARACTERS_BY_GAME_ID, isAuthenticated, getCharactersByGameId);
  app.get(ApiPath.GET_TILES_BY_GAME_ID, isAuthenticated, getTilesByGameId);
  app.get(ApiPath.GET_ACTIONS_BY_GAME_ID, isAuthenticated, getActionsByGameId);

  app.post(ApiPath.MOVE_TO_TILE, isAuthenticated, moveToTile);
  app.get(ApiPath.PREPARE_ATTACK, isAuthenticated, prepareAttack);
};
