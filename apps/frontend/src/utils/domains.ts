export const getWebsocketUrl = () =>
  `${import.meta.env.MODE === 'production' ? 'wss' : 'ws'}://${import.meta.env.VITE_APP_BE_DOMAIN}`;

export const getServerHttpUrl = () =>
  `${import.meta.env.MODE === 'production' ? 'https' : 'http'}://${
    import.meta.env.VITE_APP_BE_DOMAIN
  }`;
