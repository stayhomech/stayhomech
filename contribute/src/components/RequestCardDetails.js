import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    CardActionArea,
    InputBase,
    NativeSelect,
    Grid,
    Divider,
    CardActions,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import RequestStatus from './RequestStatus';
import RequestLang from './RequestLang';
import { useSelector, useDispatch } from 'react-redux';
import DjangoRequest from '../objects/DjangoRequest';

const useStyles = makeStyles((theme) => ({
    cardFloat: {
        float: 'right',
    }
}));

const RequestCardDetails = (props) => {

    const css = useStyles();

    const request = props.request;

    const dispatch = useDispatch();

    const selected = useSelector(state => state.requests.selected);
    const status = useSelector(state => state.requests.status);

    const token = useSelector(state => state.auth.token);

    const [dialogOpen, setDialogOpen] = useState(false);

    // Snackbar
    const openSnackBar = (severity, message) => {
        dispatch({ type:'ASYNC.SB_OPEN', payload: { severity: severity, message: message } });
    }

    const handleDeleteClick = (e) => {
        e.preventDefault();
        setDialogOpen(true);
    }

    const handleConvertClick = (e) => {
        e.preventDefault();
        dispatch((dispatch, getState) => {
            dispatch({ type: 'ASYNC.START' });
            const Request = new DjangoRequest(getState().auth.token);
            Request.set_status(request.uuid, DjangoRequest.status.RESERVED)
                .then((result) => {
                    dispatch({ type: 'REQUESTS.SET_STATUS', payload: result.new })
                    openSnackBar('info', 'Request has been reserved.');
                })
                .then(dispatch({ type: 'ASYNC.STOP' }))
        });
    }

    const handleDialogClose = () => {
        setDialogOpen(false);
    }

    const handleDialogDelete = () => {
        dispatch((dispatch, getState) => {
            dispatch({ type: 'ASYNC.START' });
            const Request = new DjangoRequest(getState().auth.token);
            Request.set_status(request.uuid, DjangoRequest.status.DELETED)
                .then((result) => {
                    dispatch({ type: 'REQUESTS.SELECT', payload: null });
                    setDialogOpen(false);
                    Request.get_stats(dispatch);
                    openSnackBar('success', 'Request has been deleted.');
                })
                .then(dispatch({ type: 'ASYNC.STOP' }))
        });
    }

    return (
        <>
            <Card key={request.uuid}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <span className={css.cardFloat}><RequestLang lang={request.lang} />  <RequestStatus status={status} /></span>
                            <Typography variant="h6" color="primary">{request.name}</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}><Typography variant="subtitle2" color="secondary">Description</Typography></Grid>
                        <Grid item xs={12}>{request.description}</Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}><Typography variant="subtitle2" color="secondary">Categories</Typography></Grid>
                        <Grid item xs={12}>{request.category}</Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}><Typography variant="subtitle2" color="secondary">Delivery perimeter</Typography></Grid>
                        <Grid item xs={12}>{request.delivery}</Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}><Typography variant="subtitle2" color="secondary">Location information</Typography></Grid>
                        <Grid item xs={12}>{request.location}</Grid>
                        <Grid item xs={6}>{request.address}</Grid>
                        <Grid item xs={6}>{request.npa}</Grid>
                        <Grid item xs={12}>
                            <Divider />
                        </Grid>
                        <Grid item xs={12}><Typography variant="subtitle2" color="secondary">Contact information</Typography></Grid>
                        <Grid item xs={12}>{request.contact}</Grid>
                        <Grid item xs={12}>{request.website}</Grid>
                        <Grid item xs={12}>{request.email}</Grid>
                        <Grid item xs={12}>{request.phone}</Grid>
                    </Grid>
                </CardContent>
                { status !== DjangoRequest.status.RESERVED &&
                    <CardActions style={{ justifyContent: 'end' }}>
                        <Button size="small" color="secondary" onClick={ handleDeleteClick }>Delete request</Button>
                        <Button size="small" color="primary" onClick={ handleConvertClick }>Convert to business</Button>
                    </CardActions>
                }
            </Card>
            <Dialog open={ dialogOpen } onClose={ handleDialogClose } aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Delete request</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this request ? Please tell us why...
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="reason"
                        label="Reason"
                        type="text"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={ handleDialogClose } color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={ handleDialogDelete } color="primary">
                        Delete request
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )

}

export default RequestCardDetails;