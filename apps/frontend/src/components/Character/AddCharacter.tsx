import { useMutation } from '@apollo/client';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { ADD_CHARACTER } from '../../graphql/mutations';
import { GET_FREE_CHARACTERS } from '../../graphql/queries';

export const AddCharacter = () => {
  const [name, setName] = useState('');
  const [addCharacter, { loading, error }] = useMutation(ADD_CHARACTER);

  if (loading) return <Box>Submitting...</Box>;
  if (error) return <Box>Submission error! {error.message}</Box>;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    addCharacter({ variables: { name }, refetchQueries: [{ query: GET_FREE_CHARACTERS }] });
  };

  return (
    <Box>
      <Typography variant="h5">Charakter erstellen</Typography>

      <form onSubmit={handleSubmit}>
        <TextField label="Name" value={name} onChange={handleChange} />
        <Button variant="outlined" disabled={!name.length || loading} type="submit">
          Erstellen
        </Button>
      </form>
    </Box>
  );
};
