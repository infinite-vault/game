import { useMutation } from '@apollo/client';
import { Box, Button, TextField } from '@mui/material';
import { ChangeEvent, useState } from 'react';
import { ADD_CHARACTER_TO_EXISTING_GAME } from '../../../graphql/mutations';
import { GET_FREE_CHARACTERS, GET_GAMES } from '../../../graphql/queries';

interface AddCharacterToExistingGame {
  characterId: number;
}

export const AddCharToExistingGame = ({ characterId }: AddCharacterToExistingGame) => {
  const [code, setCode] = useState('');
  const [addCharToExistingGame, { loading, error }] = useMutation(ADD_CHARACTER_TO_EXISTING_GAME);

  if (error) {
    return <Box>Shit happens</Box>;
  }

  const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();

    addCharToExistingGame({
      variables: { code, characterId },
      refetchQueries: [{ query: GET_FREE_CHARACTERS }, { query: GET_GAMES }],
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
