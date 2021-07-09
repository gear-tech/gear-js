import React from 'react';
import PropTypes from 'prop-types';
import {useLocation} from 'react-router-dom';
import classNames from 'classnames';

import { routes } from 'routes';

import './Main.scss';

const Main: React.StatelessComponent<{}> = ({ children }) => {
    const location = useLocation();
    const lightColored = location.pathname !== routes.main && location.pathname !== routes.uploadedPrograms;
    return (
        <main className={classNames('main', {'main--light-colored': lightColored})}>
            {children}
        </main>
    );
};

Main.propTypes = {
    children: PropTypes.node.isRequired
}

export default Main;