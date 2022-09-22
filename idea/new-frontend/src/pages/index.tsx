import { Routes, Route } from 'react-router-dom';

import { routes } from 'shared/config';

import { Home } from './home';
import { Program } from './program';
import { Programs } from './programs';
import { Message } from './message';
import { Messages } from './messages';
import { UploadProgram } from './uploadProgram';
import { NotFound } from './notFound';
import { Send } from './send';
import { Codes } from './codes';
import { InitializeProgram } from './initializeProgram';

const Routing = () => (
  <Routes>
    <Route path={routes.home} element={<Home />} />

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

    <Route path="*" element={<NotFound />} />
  </Routes>
);

export { Routing };
