import { pubsub } from '../../pubsub';
import { addCharacter } from './mutations/addCharacter';
import { addCharacterToNewGame } from './mutations/addCharacterToNewGame';
import { addCharacterToExistingGame } from './mutations/addCharacterToExistingGame';
import { queryGame } from './queries/queryGame';
import { endGame } from './mutations/endGame';
import { moveTo } from './mutations/moveTo';
import { setGameState } from './mutations/setGameState';
import { queryCharacters } from './queries/queryCharacters';
import { queryFreeCharacters } from './queries/queryFreeCharacters';
import { queryGames } from './queries/queryGames';
import { queryPlayers } from './queries/queryPlayers';
import { withFilter } from 'graphql-subscriptions';
import { queryTiles } from './queries/queryTiles';
import { PublishKey } from '../../types/PublishKey';
import { queryActions } from './queries/queryFights';
import { attack } from './mutations/attack/attack';

export const resolvers = {
  Query: {
    characters: queryCharacters,
    freeCharacters: queryFreeCharacters,
    games: queryGames,
    players: queryPlayers,
    tiles: queryTiles,
    game: queryGame,
    actions: queryActions,
  },
  Mutation: {
    addCharacter,
    addCharacterToNewGame,
    addCharacterToExistingGame,
    endGame,
    setGameState,
    moveTo,
    attack,
  },
  Subscription: {
    updateGame: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([PublishKey.UPDATE_GAME]),
        (payload, variables) => {
          console.log('SUBSCRIPTION UPDATE GAME', payload, variables);
          return payload.updateGame.id === variables.gameId;
        },
      ),
    },
    updatePlayer: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([PublishKey.UPDATE_PLAYER]),
        (payload, variables) => {
          console.log(JSON.stringify({ payload, variables }));
          return payload.updatePlayer.gameId === variables.gameId;
        },
      ),
    },
    updateTile: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([PublishKey.UPDATE_TILE]),
        (payload, variables) => payload.updateTile.gameId === variables.gameId,
      ),
    },
    updateAction: {
      subscribe: withFilter(
        () => pubsub.asyncIterator([PublishKey.UPDATE_ACTION]),
        (payload, variables) => payload.updateAction.gameId === variables.gameId,
      ),
    },
  },
};
