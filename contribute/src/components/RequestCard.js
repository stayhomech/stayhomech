import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    CardActionArea,
    InputBase,
    NativeSelect,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    Button,
    DialogActions
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RequestStatus from './RequestStatus';
import RequestLang from './RequestLang';
import { useSelector, useDispatch } from 'react-redux';
import DjangoRequest from '../objects/DjangoRequest';

const useStyles = makeStyles((theme) => ({
    cardFloat: {
        float: 'right',
    },
    cardSelected: {
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: '#8a304a',
    }
}));

const RequestCard = (props) => {

    const css = useStyles();

    const request = props.request;

    const selected = useSelector(state => state.requests.selected);
    const status = useSelector(state => state.requests.status);
    const user = useSelector(state => state.auth.user);
    const is_selected = selected && (request.uuid === selected.uuid);
    const dispatch = useDispatch();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogContent, setDialogContent] = useState(['title', 'content', 'action', false])

    const token = useSelector(state => state.auth.token);
    const Request = new DjangoRequest(token);

    const handleCardClick = (e) => {
        e.preventDefault();

        // Do nothing if the current selected request is in state "RESERVED"
        if (status === DjangoRequest.status.RESERVED) {
            setDialogContent([
                'I cannot let you that!',
                'Please cancel or finish the current conversion before choosing another request!',
                'Continue',
                false
            ]);
            setDialogOpen(true);
            return;
        }

        if (is_selected) {
            dispatch({
                type: "REQUESTS.SELECT",
                payload: null
            });
        } else {
            dispatch((dispatch, getState) => {
                Request.get(request.uuid)
                    .then((data) => {

                        // Check status
                        if (data.status !== DjangoRequest.status.NEW && !(data.status === DjangoRequest.status.RESERVED && data.owner === user.id)) {
                            setDialogContent([
                                'Oups, someone was faster...',
                                'It seems that this request is not available anymore. Someone probably already handled it!',
                                'Continue',
                                true
                            ]);
                            setDialogOpen(true);
                            return;
                        }

                        dispatch({
                            type: "REQUESTS.SELECT",
                            payload: data
                        });
                    })
            });
        }
    }

    const handleDialogClose = (reload) => {
        setDialogOpen(false);
        if (dialogContent[3]) {
            Request.get_stats(dispatch);
        }
    }

    return (
        <Card variant="outlined" key={request.uuid} className={is_selected ? css.cardSelected : null}>
            <CardActionArea onClick={ handleCardClick }>
                <CardContent>
                    <span className={css.cardFloat}><RequestLang lang={request.lang} />  <RequestStatus status={request.status} /></span>
                    <Typography variant="h6" color="primary">{request.name}</Typography>
                    <Typography variant="subtitle2">{request.location}</Typography>
                    <p>{request.description}</p>
                </CardContent>
            </CardActionArea>
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{dialogContent[0]}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {dialogContent[1]}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary" autoFocus>
                        {dialogContent[2]}
                    </Button>
                </DialogActions>
            </Dialog>
        </Card>
    )

}

export default RequestCard;