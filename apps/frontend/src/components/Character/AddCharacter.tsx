import { Box, Button, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import useAxios from 'axios-hooks';
import { ApiPath } from 'types';
import { refetchFreeCharactersAtom } from '../../store/freeCharactersState';
import { useSetAtom } from 'jotai';

export const AddCharacter = () => {
  const [name, setName] = useState('');
  const refreshFreeCharacters = useSetAtom(refetchFreeCharactersAtom);
  const [{ loading, error }, addCharacter] = useAxios(
    {
      url: ApiPath.ADD_CHARACTER,
      method: 'POST',
    },
    { manual: true },
  );

  if (loading) return <Box>Submitting...</Box>;
  if (error) return <Box>Submission error! {error.message}</Box>;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    addCharacter({ data: { name } }).then(() => {
      refreshFreeCharacters();
    });
    setName('');
  };

  return (
    <Box>
      <Typography variant="h5">Charakter erstellen</Typography>

      <form onSubmit={handleSubmit}>
        <TextField label="Name" value={name} onChange={handleChange} />
        <Button variant="outlined" disabled={!name.length} type="submit">
          Erstellen
        </Button>
      </form>
    </Box>
  );
};
