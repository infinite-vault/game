import { useQuery } from '@apollo/client';
import { Box, Button, Typography } from '@mui/material';
import { useAtomValue } from 'jotai';
import { GET_GAMES } from '../../graphql/queries';
import { RoutePaths } from '../../routing/AppRoutes';
import { authAtom } from '../../store/authState';

export const GameList = () => {
  const { loading, error, data } = useQuery(GET_GAMES);
  const userId = useAtomValue(authAtom);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <Box>
      <Typography variant="h3">Gruppen</Typography>
      {data?.games?.length ? (
        <ul>
          {data.games.map((c: any) => (
            <li key={c.id}>
              {c.name} (Code:{' '}
              <Box
                sx={{ cursor: 'pointer', color: 'blue' }}
                component="span"
                onClick={() => navigator.clipboard.writeText(c.id as string)}
              >{`${c.id}`}</Box>
              )
              <Box>
                <Button href={`${RoutePaths.GAME}/${c.id}`} variant="contained">
                  Spielen
                </Button>
              </Box>
              <ul>
                {c.characters?.length ? (
                  [...c.characters]
                    .filter((c) => c.isNpc !== true)
                    .sort((a: any, b: any) => {
                      if (a.name < b.name) {
                        return -1;
                      }
                      if (a.name > b.name) {
                        return 1;
                      }
                      return 0;
                    })
                    .map((char: any) => (
                      <li key={`char-${char.id}`}>
                        {char.name} {userId === char.userId ? '(me)' : ''}
                      </li>
                    ))
                ) : (
                  <p>Keine Spieler in dieser Gruppe</p>
                )}
              </ul>
              <div>{c.characters.filter((c: any) => c.isNpc === true).length} Monster online</div>
            </li>
          ))}
        </ul>
      ) : (
        <Box>Keine vorhanden</Box>
      )}
    </Box>
  );
};
