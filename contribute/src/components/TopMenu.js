import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Avatar,
    Menu,
    MenuItem, ThemeProvider,
} from '@material-ui/core';
import Gravatar from 'react-gravatar';

import logo_round_pin from '../assets/img/logo_round_pin.png';
import { useSelector, useDispatch } from 'react-redux';
import Backdrop from "@material-ui/core/Backdrop";
import CircularProgress from "@material-ui/core/CircularProgress";


const useStyles = makeStyles((theme) => ({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    logo: {
        height: '50px',
        width: '50px',
        padding: '10px 20px 10px 0'
    },
    grow: {
        flexGrow: 1,
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 99,
        color: '#fff',
    },
}));


const TopMenu = (props) => {

    const css = useStyles();

    const user = useSelector(state => state.auth.user);

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const dispatch = useDispatch();

    const async_in_progress = useSelector(state => state.async.running);
    if (async_in_progress) {
        setTimeout(() => {
            dispatch({ type:'ASYNC.STOP' });
        }, 10 * 1000);
    }
    
    const handleUserMenuOpen = (e) => {
        setAnchorEl(e.currentTarget);
    }

    const handleUserMenuClose = () => {
        setAnchorEl(null);
    };

    const handleUserMenuLogout = () => {
        dispatch({ type: 'AUTH.LOGOUT' });
    }
    
    return (
        <AppBar position="fixed" className={css.appBar}>
            <Backdrop className={css.backdrop} open={async_in_progress}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Toolbar>
                <img src={logo_round_pin} alt="StayHome.ch" className={css.logo} />
                <Typography variant="h6" noWrap>
                    Contribute
                </Typography>
                <div className={css.grow}></div>
                <IconButton 
                    color="inherit"
                    aria-label="User menu"
                    aria-controls="menu-topmenu-user"
                    aria-haspopup="true"
                    onClick={ handleUserMenuOpen }
                >
                    <Avatar>
                        <Gravatar email={user.email} size={40} rating="pg" default="monsterid" />
                    </Avatar>
                </IconButton>
                <Menu
                    id="menu-topmenu-user"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleUserMenuClose}
                >
                    <MenuItem onClick={handleUserMenuLogout}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    )
}

export {
    TopMenu,
}
