import { Box, Button, TextField } from '@mui/material';
import axios from 'axios';
import { useSetAtom } from 'jotai';
import { useState } from 'react';
import { authAtom } from '../../store/authState';
import { getServerHttpUrl } from '../../utils/domains';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const setAuth = useSetAtom(authAtom);

  const handleSubmit = (ev: any) => {
    ev.preventDefault();

    axios
      .post(`${getServerHttpUrl()}/login`, { email })
      .then(({ data }) => setAuth(data.id))
      .catch((err) => console.log('Login error', err));
  };

  return (
    <Box>
      <form onSubmit={handleSubmit}>
        <TextField value={email} label="E-Mail" onChange={(ev) => setEmail(ev.target.value)} />
        <Button variant="contained" type="submit">
          Anmelden
        </Button>
      </form>
    </Box>
  );
};
