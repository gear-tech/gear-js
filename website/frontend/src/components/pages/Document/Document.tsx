import React, { VFC } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { routes } from 'routes';
import { PrivacyPolicy } from '../../blocks/Documents/PrivacyPolicy';
import { DocumentFooter } from '../../blocks/Documents/DocumentFooter';
import { TermsOfUse } from '../../blocks/Documents/TermsOfUse';

export const Document: VFC = () => {
  const isPrivacyPolicyPage = useRouteMatch(routes.privacyPolicy);

  return (
    <>
      {(isPrivacyPolicyPage && <PrivacyPolicy />) || <TermsOfUse />}
      <DocumentFooter />
    </>
  );
};
