import { getServerHttpUrl, getWebsocketUrl } from '../utils/domains';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { ApolloClient, DefaultOptions, HttpLink, InMemoryCache, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({
  uri: `${getServerHttpUrl()}/graphql`,
  credentials: import.meta.env.MODE === 'production' ? 'same-origin' : 'include',
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `${getWebsocketUrl()}/graphql`,
  }),
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
  },
  wsLink,
  httpLink,
);

const defaultOptions: DefaultOptions = {
  query: { fetchPolicy: 'network-only' },
  // watchQuery: { fetchPolicy: 'cache-and-network' },
};

export const apolloClient = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache({
    // typePolicies: {
    //   Enemy: {
    //     merge: true,
    //   },
    //   Fight: {
    //     fields: {
    //       enemy: {
    //         // keyArgs: [],
    //         // merge: true,
    //         merge(existing, incoming, { mergeObjects }) {
    //           console.log('merge', { existing, incoming });
    //           return mergeObjects(existing, incoming);
    //         },
    //       },
    //     },
    //   },
    // },
  }),
  defaultOptions,
});

apolloClient.refetchQueries;
