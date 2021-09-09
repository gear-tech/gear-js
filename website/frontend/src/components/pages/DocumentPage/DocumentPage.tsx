import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { routes } from 'routes';
import { PrivacyPolicy, TermsOfUse, DocumentFooter } from 'components/blocks/Documents';

function DocumentPage () {

    const isPrivacyPolicyPage = useRouteMatch(routes.privacyPolicy);

    return (
        <>
            {
                isPrivacyPolicyPage
                &&
                <PrivacyPolicy/>
                ||
                <TermsOfUse/>
            }
            <DocumentFooter/>
        </>
    )
}

export default DocumentPage;