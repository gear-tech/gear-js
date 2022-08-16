import { Route, Routes } from 'react-router-dom';

import { routes } from 'routes';
import { useEvents } from 'hooks';
import { Main } from 'pages/Main';
import { Codes } from 'pages/Codes';
import { Messages } from 'pages/Messages';
import { AllPrograms } from 'pages/AllPrograms';
import { UserPrograms } from 'pages/UserPrograms';
import { Meta } from 'pages/Meta/Meta';
import { Send } from 'pages/Send/Send';
import { State } from 'pages/State';
import { EditorPage } from 'pages/Editor';
import { Program } from 'pages/Program/Program';
import { Mailbox } from 'pages/Mailbox';
import { Message } from 'pages/Message';
import { ExplorerBlock } from 'pages/ExplorerBlock';
import { ExplorerEvents } from 'pages/ExplorerEvents';
import { TermsOfUse } from 'pages/TermsOfUse';
import { PrivacyPolicy } from 'pages/PrivacyPolicy';
import { PageNotFound } from 'pages/PageNotFound/PageNotFound';
import { MainPageLayout } from 'layout/MainPageLayout';
import { ExplorerPageLayout } from 'layout/ExplorerPageLayout';

const AppRoutes = () => {
  const events = useEvents();

  return (
    <Routes>
      <Route path={routes.main} element={<MainPageLayout />}>
        <Route index element={<Main />} />
        <Route path={routes.codes} element={<Codes />} />
        <Route path={routes.messages} element={<Messages />} />
        <Route path={routes.allPrograms} element={<AllPrograms />} />
        <Route path={routes.uploadedPrograms} element={<UserPrograms />} />
      </Route>

      <Route path={routes.explorer} element={<ExplorerPageLayout />}>
        <Route index element={<ExplorerEvents events={events} />} />
        <Route path=":blockId" element={<ExplorerBlock />} />
      </Route>

      <Route path={routes.send}>
        <Route path={routes.reply} element={<Send />} />
        <Route path={routes.sendMessage} element={<Send />} />
      </Route>

      <Route path={routes.meta} element={<Meta />} />
      <Route path={routes.state} element={<State />} />
      <Route path={routes.mailbox} element={<Mailbox />} />
      <Route path={routes.message} element={<Message />} />
      <Route path={routes.program} element={<Program />} />
      <Route path={routes.editor} element={<EditorPage />} />

      <Route path={routes.termsOfUse} element={<TermsOfUse />} />
      <Route path={routes.privacyPolicy} element={<PrivacyPolicy />} />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export { AppRoutes };
