import React, { useEffect } from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Toolbar, Chip } from '@material-ui/core';
import MoveToInboxIcon from '@material-ui/icons/MoveToInbox';
import { makeStyles } from '@material-ui/core/styles';
import { Link as RouterLink, useRouteMatch } from 'react-router-dom';
import DjangoRequest from '../objects/DjangoRequest';
import { useSelector, useDispatch } from 'react-redux';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
    },
    drawerContainer: {
        paddingTop: '10px',
        overflow: 'auto',
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    sectionHead: {
        borderBottom: '1px solid #e9ebee'
    }
}));

const ListItemLink = (props) => {

    const css = useStyles();

    const { icon, primary, to, badge } = props;
  
    const renderLink = React.useMemo(
      () => React.forwardRef((itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />),
      [to],
    );
  
    return (
      <li>
        <ListItem button component={renderLink} className={css.nested} >
          {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
          <ListItemText primary={primary} />
          {badge && badge}
        </ListItem>
      </li>
    );
}

const LeftNav = (props) => {

    const css = useStyles();
    const { path, url } = useRouteMatch();

    const token = useSelector(state => state.auth.token);
    const stats = useSelector(state => state.requests.stats);
    const dispatch = useDispatch();

    useEffect(() => {
        const Request = new DjangoRequest(token);
        dispatch({ type: 'ASYNC.START '});
        Request.stats()
            .then((result) => {
                dispatch({ type:'REQUESTS.STATS', payload: result });
                dispatch({ type: 'ASYNC.STOP '});
            });
    }, []);

    return (
        <Drawer
            variant="permanent"
            className={css.drawer}
            classes={{
                paper: css.drawerPaper
            }}
        >
            <Toolbar />
            <div className={css.drawerContainer}>
                <List
                    component="nav"
                >
                    <ListItem className={css.sectionHead}>
                        <ListItemIcon>
                            <MoveToInboxIcon />
                        </ListItemIcon>
                        <ListItemText primary="Requests" />
                    </ListItem>
                    <List component="div" disablePadding>
                        <ListItemLink
                            button 
                            to={`${url}requests/pending`}
                            primary="Pending"
                            badge={stats.new && <Chip size="small" color="secondary" label={stats.new} />}
                        />
                        {/*
                        <ListItemLink
                            button 
                            to={`${url}requests/updated`}
                            primary="Updated"
                            badge={stats.updated && <Chip size="small" color="secondary" label={stats.updated} />}
                        />
                        */}
                        <ListItemLink
                            button 
                            to={`${url}requests/draft`}
                            primary="Drafts"
                            badge={stats.drafts && <Chip size="small" color="secondary" label={stats.drafts} />}
                        />
                    </List>
                </List>
            </div>
        </Drawer>
    )

}

export default LeftNav;