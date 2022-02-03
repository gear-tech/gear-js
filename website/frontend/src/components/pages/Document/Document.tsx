import React, { VFC } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { routes } from 'routes';
import { Main } from 'common/components/Main/Main';
import { PrivacyPolicy } from '../../blocks/Documents/PrivacyPolicy';
import { DocumentFooter } from '../../blocks/Documents/DocumentFooter';
import { TermsOfUse } from '../../blocks/Documents/TermsOfUse';

export const Document: VFC = () => {
  const isPrivacyPolicyPage = useRouteMatch(routes.privacyPolicy);

  return (
    <Main>
      {(isPrivacyPolicyPage && <PrivacyPolicy />) || <TermsOfUse />}
      <DocumentFooter />
    </Main>
  );
};
