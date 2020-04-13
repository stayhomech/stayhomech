import React from 'react';
import { useSelector } from 'react-redux';
import { 
    Route,
    Redirect,
    useRouteMatch
 } from "react-router-dom";

const PrivateRoute = ({ children, ...rest }) => {

    const authenticated = useSelector(state => state.auth.authenticated);
    const { path, url } = useRouteMatch();

    return (
        <Route
            {...rest}
            render={({ location }) =>
                authenticated ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: path + "login",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}

export {
    PrivateRoute
}