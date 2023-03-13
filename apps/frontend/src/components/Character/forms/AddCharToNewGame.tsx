import { useMutation } from '@apollo/client';
import { Box, Button, TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { ADD_CHARACTER_TO_NEW_GAME } from '../../../graphql/mutations';
import { GET_FREE_CHARACTERS, GET_GAMES } from '../../../graphql/queries';

interface AddCharToNewGameProps {
  characterId: string;
}

export const AddCharToNewGame = ({ characterId }: AddCharToNewGameProps) => {
  const [newGame, setNewGame] = useState('');
  const [addCharToGame, { loading, error }] = useMutation(ADD_CHARACTER_TO_NEW_GAME);

  if (error) {
    return <Box>Shit happens</Box>;
  }

  const handleNewGameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewGame(event.target.value);
  };

  const handleNewGameSubmit = async (event: any) => {
    event.preventDefault();

    addCharToGame({
      variables: { name: newGame, characterId },
      refetchQueries: [{ query: GET_FREE_CHARACTERS }, { query: GET_GAMES }],
    });
  };

  return (
    <form onSubmit={handleNewGameSubmit}>
      <TextField size="small" label="Name" onChange={handleNewGameChange} value={newGame} />
      <Button variant="outlined" type="submit" disabled={!newGame.length || loading}>
        OK
      </Button>
    </form>
  );
};
