import React, {useEffect} from 'react';

import LeftNav from './LeftNav'
import ListRequests from './ListRequests'
import {Dialog, Toolbar} from '@material-ui/core';
import { Switch, Route, useRouteMatch } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";
import {useDispatch, useSelector} from "react-redux";
import DjangoRequest from '../objects/DjangoRequest';


const useStyles = makeStyles((theme) => ({
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
}));


const MainContent = (props) => {

    const css = useStyles();
    const { path, url } = useRouteMatch();

    // Auth token
    const token = useSelector(state => state.auth.token);

    // Redux
    const dispatch = useDispatch();

    // Snackbar
    const sbOpen = useSelector(state => state.async.sb.open);
    const sbSeverity = useSelector(state => state.async.sb.severity);
    const sbMessage = useSelector(state => state.async.sb.message);
    const handleSbClose = () => {
        dispatch({ type:'ASYNC.SB_CLOSE' });
    }

    // Stats
    const loadStats = () => {
        const Request = new DjangoRequest(token);
        Request.stats()
            .then((result) => {
                dispatch({ type:'REQUESTS.STATS', payload: result });
            });
    }
    useEffect(() => {
        loadStats();
        const interval = setInterval(loadStats, 30000);
        return () => clearInterval(interval);
    }, []);


    return (
        <>
            <LeftNav />
            <main className={css.content}>
                <Toolbar />
                <Switch>
                    <Route path={`${path}requests/:status`}>
                        <ListRequests />
                    </Route>
                </Switch>
                <Snackbar open={sbOpen} autoHideDuration={6000} onClose={handleSbClose}>
                    <Alert onClose={handleSbClose} severity={sbSeverity}>
                        {sbMessage}
                    </Alert>
                </Snackbar>
            </main>
        </>
    )

}

export default MainContent;