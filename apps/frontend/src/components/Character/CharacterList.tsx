import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { AddCharacter } from './AddCharacter';
import { AddCharToExistingGame } from './forms/AddCharToExistingGroup';
import { AddCharToNewGame } from './forms/AddCharToNewGame';
import { useAtomValue } from 'jotai';
import { freeCharactersAtom } from '../../store/freeCharactersState';

// const useSocketSubscription = () => {
//   const [myCharacters, setMyCharacters] = useAtom(myCharactersAtom);

//   useEffect(() => {
//     console.log('listen to updateMyCharacters');
//     socket.on('updateMyCharacters', (character: any) => {
//       console.log('updateMyCharacters', character);
//       setMyCharacters([...((myCharacters as any) || []), 'foo']);
//     });

//     return () => {
//       socket.off('updateMyCharacters');
//     };
//   }, []);
// };

export const CharacterList = () => {
  const freeCharacters = useAtomValue(freeCharactersAtom);
  const [showForm, setShowForm] = useState<number>();
  // useSocketSubscription();

  return (
    <Box>
      <Typography variant="h3">Freie Charaktere</Typography>

      <AddCharacter />

      {freeCharacters?.length ? (
        <ul>
          {freeCharacters.map((c: any) => (
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
