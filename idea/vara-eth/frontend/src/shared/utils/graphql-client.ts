import { GraphQLClient } from 'graphql-request';

import { EXPLORER_URL } from '../config';

export const graphqlClient = new GraphQLClient(EXPLORER_URL);
