import { Button } from '@mui/material';
import axios from 'axios';
import { useSetAtom } from 'jotai';
import { apolloClient } from '../../graphql/apolloClient';
import { authAtom } from '../../store/authState';
import { getServerHttpUrl } from '../../utils/domains';

export const LogoutButton = () => {
  const setAuth = useSetAtom(authAtom);

  const handleClick = () => {
    axios.get(`${getServerHttpUrl()}/logout`).catch((err) => console.log('Logout error', err));
    setAuth('');
    apolloClient.clearStore();
  };

  return (
    <Button variant="outlined" onClick={handleClick}>
      Logout
    </Button>
  );
};
