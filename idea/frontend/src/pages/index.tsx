import { Routes, Route, Navigate } from 'react-router-dom';

import { routes } from 'shared/config';
import { useEvents } from 'hooks';

import { Program } from './program';
import { Programs } from './programs';
import { Message } from './message';
import { Messages } from './messages';
import { UploadProgram } from './uploadProgram';
import { NotFound } from './notFound';
import { Send } from './send';
import { Codes } from './codes';
import { InitializeProgram } from './initializeProgram';
import { Mailbox } from './mailbox';
import * as State from './state';
import * as Explorer from './explorer';
import { Code } from './code';

const Routing = () => {
  const events = useEvents();

  return (
    <Routes>
      <Route path={routes.programs}>
        <Route index element={<Programs />} />
        <Route path={routes.uploadProgram} element={<UploadProgram />} />
        <Route path={routes.program} element={<Program />} />
      </Route>

      <Route path={routes.messages}>
        <Route index element={<Messages />} />
        <Route path={routes.message} element={<Message />} />
      </Route>

      <Route path={routes.send}>
        <Route path={routes.reply} element={<Send />} />
        <Route path={routes.sendMessage} element={<Send />} />
      </Route>

      <Route path={routes.codes}>
        <Route index element={<Codes />} />
        <Route path={routes.initializeProgram} element={<InitializeProgram />} />
      </Route>

      <Route path="/state" element={<State.Layout />}>
        <Route path=":programId" element={<State.Main />} />
        <Route path="full/:programId" element={<State.Full />} />
        <Route path="wasm/:programId" element={<State.Wasm />} />
      </Route>

      <Route path={routes.mailbox} element={<Mailbox />} />

      <Route path={routes.explorer} element={<Explorer.Layout />}>
        <Route index element={<Explorer.Events events={events} />} />
        <Route path={routes.block} element={<Explorer.Block />} />
      </Route>

      <Route path={routes.code} element={<Code />} />

      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Navigate to={routes.programs} replace />} />
    </Routes>
  );
};

export { Routing };
