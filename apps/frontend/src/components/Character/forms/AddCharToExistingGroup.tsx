import { Box, Button, TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { useSetAtom } from 'jotai';
import { ApiPath } from 'types';
import useAxios from 'axios-hooks';
import { refetchFreeCharactersAtom } from '../../../store/freeCharactersState';
import { refetchMyGamesAtom } from '../../../store/myGamesState';

interface AddCharacterToExistingGame {
  characterId: number;
}

export const AddCharToExistingGame = ({ characterId }: AddCharacterToExistingGame) => {
  const [code, setCode] = useState('');
  const refetchFreeCharacters = useSetAtom(refetchFreeCharactersAtom);
  const refetchMyGames = useSetAtom(refetchMyGamesAtom);
  const [{ loading, error }, addCharacterToExistingGame] = useAxios(
    {
      url: ApiPath.ADD_CHARACTER_TO_EXISTING_GAME,
      method: 'POST',
    },
    { manual: true },
  );

  if (loading) return <Box>Submitting...</Box>;
  if (error) return <Box>Submission error! {error.message}</Box>;

  const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    addCharacterToExistingGame({
      data: { code, characterId },
    }).then(() => {
      refetchFreeCharacters();
      refetchMyGames();
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField size="small" label="Code" onChange={handleCodeChange} value={code} />
      <Button variant="outlined" type="submit" disabled={!code.length || loading}>
        OK
      </Button>
    </form>
  );
};
