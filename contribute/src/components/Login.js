import React, { useState } from 'react';
import $ from 'jquery';

import { Container, CssBaseline, Paper, TextField, Typography, Button, CircularProgress } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';

import logo_round_pin from '../assets/img/logo_round_pin.png';
import DjangoAuth from '../objects/DjangoAuth';
import { useDispatch } from 'react-redux';

const useStyles = makeStyles(theme => ({
    paper: {
        marginTop: '15vh',
        padding: '40px'
    },
    logoDiv: {
        textAlign: 'center',
    },
    logo: {
        width: '120px',
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    spinner: {
        marginLeft: '20px',
    },
    error: {
        color: 'red'
    }
}));

const Login = (props) => {

    const [formError, setFormError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [authenticating, setAuthenticating] = useState(false);

    const dispatch = useDispatch();

    const css = useStyles();

    const Auth = new DjangoAuth();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Feedback
        setAuthenticating(true);

        // Check username
        var username = $('#username').val();
        if (username === '') {
            setEmailError('Email address cannot be empty');
            setAuthenticating(false);
            return
        } else {
            setEmailError(null);
        }

        // Check password
        var password = $('#password').val();
        if (password === '') {
            setPasswordError('Password cannot be empty');
            setAuthenticating(false);
            return
        } else {
            setPasswordError(null);
        }

        // Perform authentication
        setFormError(null);
        Auth.authenticate(username, password)
            .then(result => {
                setAuthenticating(false);
                dispatch({ type: 'AUTH.LOGIN', payload: result });
            })
            .catch(e => {
                setAuthenticating(false);
                setFormError(e.message);
            });

    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Paper className={css.paper}>
                <div className={css.logoDiv}>
                    <img src={logo_round_pin} className={css.logo} alt="StayHome.ch logo" />
                    <Typography variant="h6" color="primary">Contribute area login</Typography>
                </div>
                <form action="/">
                    {(formError) && <p className={css.error}>{formError}</p>}
                    <TextField
                        error={emailError != null}
                        helperText={emailError != null ? emailError : ''}
                        variant="standard"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        size="small"
                    />
                    <TextField
                        error={passwordError != null}
                        helperText={passwordError != null ? passwordError : ''}
                        variant="standard"
                        margin="normal"
                        required
                        fullWidth
                        id="password"
                        label="Password"
                        type="password"
                        name="password"
                        autoComplete="password"
                        size="small"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={css.submit}
                        onClick={handleSubmit}
                    >
                        Sign in
                        {(authenticating) && 
                            <CircularProgress size="1rem" color="inherit" className={css.spinner} />
                        }
                    </Button>
                </form>
            </Paper>
        </Container>
    );

}

export default Login;