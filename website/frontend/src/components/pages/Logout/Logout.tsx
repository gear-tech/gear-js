import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { Redirect } from "react-router-dom";

import { routes } from "routes";
import { logoutFromAccountAction } from 'store/actions/actions';

function Logout(){

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(logoutFromAccountAction());
    });

    return <Redirect to={routes.signIn} />;
}

export default Logout;