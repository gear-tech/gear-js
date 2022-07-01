import { VFC } from 'react';
import { useMatch } from 'react-router-dom';

import { routes } from 'routes';
import { PrivacyPolicy } from 'components/blocks/Documents/PrivacyPolicy';
import { TermsOfUse } from 'components/blocks/Documents/TermsOfUse';

export const Document: VFC = () => {
  const isPrivacyPolicyPage = useMatch(routes.privacyPolicy);

  return isPrivacyPolicyPage ? <PrivacyPolicy /> : <TermsOfUse />;
};
