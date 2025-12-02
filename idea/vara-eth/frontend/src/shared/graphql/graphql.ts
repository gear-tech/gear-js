/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /**
   * A signed eight-byte integer. The upper big integer values are greater than the
   * max value for a JavaScript number. Therefore all big integers will be output as
   * strings and not numbers.
   */
  BigInt: { input: string; output: string; }
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: { input: any; output: any; }
};

export type Code = Node & {
  __typename?: 'Code';
  id: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  status: Scalars['String']['output'];
};

/** A condition to be used against `Code` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type CodeCondition = {
  /** Checks for equality with the object’s `id` field. */
  id: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `status` field. */
  status: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `Code` values. */
export type CodesConnection = {
  __typename?: 'CodesConnection';
  /** A list of edges which contains the `Code` and cursor to aid in pagination. */
  edges: Array<CodesEdge>;
  /** A list of `Code` objects. */
  nodes: Array<Code>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Code` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Code` edge in the connection. */
export type CodesEdge = {
  __typename?: 'CodesEdge';
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars['Cursor']['output']>;
  /** The `Code` at the end of the edge. */
  node: Code;
};

/** Methods to use when ordering `Code`. */
export enum CodesOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  StatusAsc = 'STATUS_ASC',
  StatusDesc = 'STATUS_DESC'
}

export type Migration = Node & {
  __typename?: 'Migration';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  timestamp: Scalars['BigInt']['output'];
};

/**
 * A condition to be used against `Migration` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type MigrationCondition = {
  /** Checks for equality with the object’s `id` field. */
  id: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `timestamp` field. */
  timestamp: InputMaybe<Scalars['BigInt']['input']>;
};

/** A connection to a list of `Migration` values. */
export type MigrationsConnection = {
  __typename?: 'MigrationsConnection';
  /** A list of edges which contains the `Migration` and cursor to aid in pagination. */
  edges: Array<MigrationsEdge>;
  /** A list of `Migration` objects. */
  nodes: Array<Migration>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Migration` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Migration` edge in the connection. */
export type MigrationsEdge = {
  __typename?: 'MigrationsEdge';
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars['Cursor']['output']>;
  /** The `Migration` at the end of the edge. */
  node: Migration;
};

/** Methods to use when ordering `Migration`. */
export enum MigrationsOrderBy {
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TimestampAsc = 'TIMESTAMP_ASC',
  TimestampDesc = 'TIMESTAMP_DESC'
}

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor: Maybe<Scalars['Cursor']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor: Maybe<Scalars['Cursor']['output']>;
};

export type Program = Node & {
  __typename?: 'Program';
  abiInterfaceAddress: Maybe<Scalars['String']['output']>;
  codeId: Scalars['String']['output'];
  createdAtBlock: Scalars['BigInt']['output'];
  createdAtTx: Scalars['String']['output'];
  id: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
};

/** A condition to be used against `Program` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ProgramCondition = {
  /** Checks for equality with the object’s `abiInterfaceAddress` field. */
  abiInterfaceAddress: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `codeId` field. */
  codeId: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `createdAtBlock` field. */
  createdAtBlock: InputMaybe<Scalars['BigInt']['input']>;
  /** Checks for equality with the object’s `createdAtTx` field. */
  createdAtTx: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `Program` values. */
export type ProgramsConnection = {
  __typename?: 'ProgramsConnection';
  /** A list of edges which contains the `Program` and cursor to aid in pagination. */
  edges: Array<ProgramsEdge>;
  /** A list of `Program` objects. */
  nodes: Array<Program>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Program` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Program` edge in the connection. */
export type ProgramsEdge = {
  __typename?: 'ProgramsEdge';
  /** A cursor for use in pagination. */
  cursor: Maybe<Scalars['Cursor']['output']>;
  /** The `Program` at the end of the edge. */
  node: Program;
};

/** Methods to use when ordering `Program`. */
export enum ProgramsOrderBy {
  AbiInterfaceAddressAsc = 'ABI_INTERFACE_ADDRESS_ASC',
  AbiInterfaceAddressDesc = 'ABI_INTERFACE_ADDRESS_DESC',
  CodeIdAsc = 'CODE_ID_ASC',
  CodeIdDesc = 'CODE_ID_DESC',
  CreatedAtBlockAsc = 'CREATED_AT_BLOCK_ASC',
  CreatedAtBlockDesc = 'CREATED_AT_BLOCK_DESC',
  CreatedAtTxAsc = 'CREATED_AT_TX_ASC',
  CreatedAtTxDesc = 'CREATED_AT_TX_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  /** Reads and enables pagination through a set of `Code`. */
  allCodes: Maybe<CodesConnection>;
  /** Reads and enables pagination through a set of `Migration`. */
  allMigrations: Maybe<MigrationsConnection>;
  /** Reads and enables pagination through a set of `Program`. */
  allPrograms: Maybe<ProgramsConnection>;
  /** Reads a single `Code` using its globally unique `ID`. */
  code: Maybe<Code>;
  codeById: Maybe<Code>;
  /** Reads a single `Migration` using its globally unique `ID`. */
  migration: Maybe<Migration>;
  migrationById: Maybe<Migration>;
  /** Fetches an object given its globally unique `ID`. */
  node: Maybe<Node>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID']['output'];
  /** Reads a single `Program` using its globally unique `ID`. */
  program: Maybe<Program>;
  programById: Maybe<Program>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllCodesArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<CodeCondition>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CodesOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllMigrationsArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<MigrationCondition>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<MigrationsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryAllProgramsArgs = {
  after: InputMaybe<Scalars['Cursor']['input']>;
  before: InputMaybe<Scalars['Cursor']['input']>;
  condition: InputMaybe<ProgramCondition>;
  first: InputMaybe<Scalars['Int']['input']>;
  last: InputMaybe<Scalars['Int']['input']>;
  offset: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ProgramsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryCodeArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryCodeByIdArgs = {
  id: Scalars['String']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMigrationArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryMigrationByIdArgs = {
  id: Scalars['Int']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProgramArgs = {
  nodeId: Scalars['ID']['input'];
};


/** The root query type which gives access points into the data universe. */
export type QueryProgramByIdArgs = {
  id: Scalars['String']['input'];
};

export type GetCodesQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type GetCodesQuery = { __typename?: 'Query', allCodes: { __typename?: 'CodesConnection', totalCount: number, nodes: Array<{ __typename?: 'Code', id: string, status: string }> } | null };

export type GetCodeByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetCodeByIdQuery = { __typename?: 'Query', codeById: { __typename?: 'Code', id: string, status: string } | null };

export type GetProgramsQueryVariables = Exact<{
  first: Scalars['Int']['input'];
  offset: Scalars['Int']['input'];
}>;


export type GetProgramsQuery = { __typename?: 'Query', allPrograms: { __typename?: 'ProgramsConnection', totalCount: number, nodes: Array<{ __typename?: 'Program', id: string, codeId: string, createdAtBlock: string, createdAtTx: string }> } | null };

export type GetProgramByIdQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetProgramByIdQuery = { __typename?: 'Query', programById: { __typename?: 'Program', id: string, codeId: string, createdAtBlock: string, createdAtTx: string, abiInterfaceAddress: string | null } | null };


export const GetCodesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCodes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allCodes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetCodesQuery, GetCodesQueryVariables>;
export const GetCodeByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCodeById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"codeById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"status"}}]}}]}}]} as unknown as DocumentNode<GetCodeByIdQuery, GetCodeByIdQueryVariables>;
export const GetProgramsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetPrograms"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"first"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"offset"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allPrograms"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"first"},"value":{"kind":"Variable","name":{"kind":"Name","value":"first"}}},{"kind":"Argument","name":{"kind":"Name","value":"offset"},"value":{"kind":"Variable","name":{"kind":"Name","value":"offset"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nodes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"codeId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAtBlock"}},{"kind":"Field","name":{"kind":"Name","value":"createdAtTx"}}]}},{"kind":"Field","name":{"kind":"Name","value":"totalCount"}}]}}]}}]} as unknown as DocumentNode<GetProgramsQuery, GetProgramsQueryVariables>;
export const GetProgramByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProgramById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"programById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"codeId"}},{"kind":"Field","name":{"kind":"Name","value":"createdAtBlock"}},{"kind":"Field","name":{"kind":"Name","value":"createdAtTx"}},{"kind":"Field","name":{"kind":"Name","value":"abiInterfaceAddress"}}]}}]}}]} as unknown as DocumentNode<GetProgramByIdQuery, GetProgramByIdQueryVariables>;