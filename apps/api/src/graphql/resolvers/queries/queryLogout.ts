export const queryLogout = (_parent: any, _args: any, { res }: any) => {
  res.clearCookie('jwt');
  return 'logout';
};
