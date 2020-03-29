import React from 'react';
import { ThemeProvider } from '@material-ui/core';
import {
    BrowserRouter as Router,
    Switch,
    Route,
  } from "react-router-dom";
import theme from './styles/contribute';
import { PrivateRoute } from './components/PrivateRoute'
import { TopMenu } from './components/TopMenu';
import Login from './components/Login';
import Logout from './components/Logout';
import MainContent from './components/MainContent';
import { makeStyles } from '@material-ui/core/styles';
import {Provider, useSelector} from 'react-redux';
import storeFactory from './store';

// Store
const store = storeFactory();
window.store = store;

// Root style
const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: '#e9ebee',
        display: 'flex',
    },
}));

// Main App
const App = () => {

    const css = useStyles();

    return (
        <div className={css.root}>
            <Provider store={store}>
            <ThemeProvider theme={theme}>
                <Router basename="/contribute">
                    <Switch>
                        <Route exact path="/login">
                            <Login />
                        </Route>
                        <Route exact path="/logout">
                            <Logout />
                        </Route>
                        <PrivateRoute path="/">
                            <TopMenu />
                            <MainContent />
                        </PrivateRoute>
                    </Switch>
                </Router>
            </ThemeProvider>
            </Provider>
        </div>
    );

}

export default App;
