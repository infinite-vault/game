import { Box, Button, TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import useAxios from 'axios-hooks';
import { ApiPath } from 'types';
import { useSetAtom } from 'jotai';
import { refetchFreeCharactersAtom } from '../../../store/freeCharactersState';
import { refetchMyGamesAtom } from '../../../store/myGamesState';

interface AddCharToNewGameProps {
  characterId: string;
}

export const AddCharToNewGame = ({ characterId }: AddCharToNewGameProps) => {
  const [name, setName] = useState('');
  const refetchFreeCharacters = useSetAtom(refetchFreeCharactersAtom);
  const refetchMyGames = useSetAtom(refetchMyGamesAtom);
  const [{ loading, error }, addCharacterToGame] = useAxios(
    {
      url: ApiPath.ADD_CHARACTER_TO_NEW_GAME,
      method: 'POST',
    },
    { manual: true },
  );

  if (loading) return <Box>Submitting...</Box>;
  if (error) return <Box>Submission error! {error.message}</Box>;

  const handleNewGameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleNewGameSubmit = async (event: any) => {
    event.preventDefault();

    addCharacterToGame({
      data: { name, characterId },
    }).then(() => {
      refetchFreeCharacters();
      refetchMyGames();
    });
  };

  return (
    <form onSubmit={handleNewGameSubmit}>
      <TextField size="small" label="Name" onChange={handleNewGameChange} value={name} />
      <Button variant="outlined" type="submit" disabled={!name.length}>
        OK
      </Button>
    </form>
  );
};
