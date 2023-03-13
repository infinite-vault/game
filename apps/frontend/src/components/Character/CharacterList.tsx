import { useQuery } from '@apollo/client';
import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { GET_FREE_CHARACTERS } from '../../graphql/queries';
import { AddCharacter } from './AddCharacter';
import { AddCharToExistingGame } from './forms/AddCharToExistingGroup';
import { AddCharToNewGame } from './forms/AddCharToNewGame';

export const CharacterList = () => {
  const { loading, error, data } = useQuery(GET_FREE_CHARACTERS);
  const [showForm, setShowForm] = useState<number>();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <Box>
      <Typography variant="h3">Freie Charaktere</Typography>

      <AddCharacter />

      {data?.freeCharacters?.length ? (
        <ul>
          {data?.freeCharacters.map((c: any) => (
            <li key={c.id}>
              {c.name} (
              <Typography
                sx={{ cursor: 'pointer', fontSize: '80%' }}
                component="span"
                onClick={() => setShowForm(showForm === c.id ? null : c.id)}
              >
                Gruppe+
              </Typography>
              )
              {showForm === c.id && (
                <Box>
                  <Box sx={{ p: '4px' }}>
                    <Typography>Bestehende Gruppe (siehe Code)</Typography>
                    <AddCharToExistingGame characterId={c.id} />
                  </Box>
                  <Box sx={{ p: '4px' }}>
                    <Typography>Neue Gruppe erstellen</Typography>
                    <AddCharToNewGame characterId={c.id} />
                  </Box>
                </Box>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <Box>Keine vorhanden</Box>
      )}
    </Box>
  );
};
