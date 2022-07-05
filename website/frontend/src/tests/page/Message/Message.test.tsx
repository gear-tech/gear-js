import { decodeHexTypes, createPayloadTypeStructure, Metadata } from '@gear-js/api';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { screen, render, fireEvent, waitFor } from '@testing-library/react';

import { MESSAGE_ID, MESSAGE } from './inputData';

import { routes } from 'routes';
import { Message } from 'components/pages/Message';

const MessagePage = () => (
  <MemoryRouter initialEntries={[`/message/${MESSAGE_ID}`]}>
    <Routes>
      <Route path={routes.message} element={<Message />} />
    </Routes>
  </MemoryRouter>
);

describe('message page tests', () => {});
