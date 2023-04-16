import { Box, Typography } from '@mui/material';
import { DashboardIcon } from './icons/DashboardIcon';
import { NavState } from '../../types/NavState';
import { navAtom } from '../../store/navState';
import { useAtom } from 'jotai';

const NavItems = [
  {
    label: 'Dashboard',
    id: NavState.HOME,
    icon: <DashboardIcon />,
  },
  {
    label: 'Players',
    id: NavState.PLAYERS,
    icon: <DashboardIcon />,
  },
  {
    label: 'Actions',
    id: NavState.FIGHTS,
    icon: <DashboardIcon />,
  },
];

export const Navigation = () => {
  const [navState, setNavState] = useAtom(navAtom);

  // TODO add some smart keyboard navigation here

  return (
    <Box sx={{ position: 'absolute', top: 0, left: 0 }}>
      {NavItems.map((item) => (
        <Box
          key={item.id}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            p: '20px 10px 0',
            cursor: 'pointer',
          }}
          onClick={() => setNavState(item.id)}
        >
          {item.icon}
          <Typography sx={{ fontSize: 10, color: navState === item.id ? 'green' : 'inherit' }}>
            {item.label}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
