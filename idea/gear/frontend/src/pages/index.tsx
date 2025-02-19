import { Routes, Route, Navigate } from 'react-router-dom';

import { VERIFY_ROUTES } from '@/features/code-verifier';
import { Events, Block } from '@/features/explorer';
import { useEvents } from '@/hooks';
import { routes } from '@/shared/config';

import { Code } from './code';
import { Codes } from './codes';
import { Dns } from './dns';
import { Explorer } from './explorer';
import { InitializeProgram } from './initializeProgram';
import { Mailbox } from './mailbox';
import { Message } from './message';
import { NotFound } from './notFound';
import { Program } from './program';
import { Programs } from './programs';
import { Send } from './send';
import { SingleDns } from './single-dns';
import * as State from './state';
import { UploadCode } from './uploadCode';
import { UploadProgram } from './uploadProgram';
import { VerificationStatus } from './verification-status';
import { Verify } from './verify';
import { Vouchers } from './vouchers';

const Routing = () => {
  const events = useEvents();

  return (
    <Routes>
      <Route path={routes.programs}>
        <Route index element={<Programs />} />
        <Route path={routes.uploadProgram} element={<UploadProgram />} />
        <Route path={routes.program} element={<Program />} />
      </Route>

      <Route path={routes.message} element={<Message />} />

      <Route path={routes.send}>
        <Route path={routes.reply} element={<Send />} />
        <Route path={routes.sendMessage} element={<Send />} />
      </Route>

      <Route path={routes.codes}>
        <Route index element={<Codes />} />
        <Route path={routes.initializeProgram} element={<InitializeProgram />} />
      </Route>

      <Route path={routes.state} element={<State.Full />} />
      <Route path={routes.sailsState} element={<State.Sails />} />

      <Route path={routes.mailbox} element={<Mailbox />} />

      <Route path={routes.explorer} element={<Explorer />}>
        <Route index element={<Events events={events} />} />
        <Route path={routes.block} element={<Block />} />
      </Route>

      <Route path={routes.code} element={<Code />} />
      <Route path={routes.uploadCode} element={<UploadCode />} />

      <Route path={routes.vouchers} element={<Vouchers />} />

      <Route path={routes.dns}>
        <Route index element={<Dns />} />
        <Route path={routes.singleDns} element={<SingleDns />} />
      </Route>

      <Route path={VERIFY_ROUTES.CODE} element={<Verify />} />
      <Route path={VERIFY_ROUTES.STATUS} element={<VerificationStatus />} />

      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<Navigate to={routes.programs} replace />} />
    </Routes>
  );
};

export { Routing };
