import React from 'react';
import {useLocation} from 'react-router-dom';
import classNames from 'classnames';

import './Main.scss';

const Main: React.StatelessComponent<{}> = (props) => {
    const location = useLocation();
    const lightColored = location.pathname !== '/upload-program' && location.pathname !== '/uploaded-programs';
    return (
        <main className={classNames('main', {'main--light-colored': lightColored})}>
            {props.children}
        </main>
    );
};

export default Main;