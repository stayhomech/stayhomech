import React, { useEffect, useState } from 'react';
import DjangoRequest from '../objects/DjangoRequest';
import { useSelector } from 'react-redux';
import { Card, CardContent, Divider, ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography, Badge, Grid } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ErrorIcon from '@material-ui/icons/Error';
import RequestLang from './RequestLang';
import RequestStatus from './RequestStatus';
import BusinessStatus from './BusinessStatus';


const useStyles = makeStyles((theme) => ({
    warning: {
        color: theme.palette.warning.main,
        verticalAlign: 'middle',
        display: 'inline-flex'
    },
    error: {
        color: theme.palette.error.main,
        verticalAlign: 'middle',
        display: 'inline-flex'
    },
}));

const RequestSimilars = (props) => {

    const css = useStyles();

    const token = useSelector(state => state.auth.token);
    const [similars, setSimilars] = useState({ requests: [], businesses: []});

    useEffect(() => {
        async function getList () {
            const Request = new DjangoRequest(token);
            const data = await Request.find_similar(props.request.uuid);
            if ('data' in data) {
                setSimilars(data.data);
            }
        }
        getList();
    }, [props.request.uuid]);

    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const data = {
        businesses: {
            color: 'error',
            type: 'business',
            objects: []
        },
        requests: {
            color: 'warning',
            type: 'request',
            objects: []
        }
    };
    similars.businesses.map((s) => {
        data.businesses.objects.push(s);
    });
    similars.requests.map((s) => {
        data.requests.objects.push(s);
    });

    const boxes = [];
    var index = 1;

    Object.keys(data).map((key) => {

        var color = data[key].color;
        var type = data[key].type;

        data[key].objects.map((o) => {

            boxes.push(
                <ExpansionPanel expanded={expanded === 'panel' + index} onChange={handleChange('panel' + index)}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={"panel" + index + "bh-content"}
                        id={"panel" + index + "bh-header"}
                    >
                        <Grid container spacing={0}>
                            <Grid item xs={12}>
                                <Grid container spacing={2} justify="space-between" alignItems="center">
                                    <Grid item alignContent="flex-start">
                                        <Typography variant="subtitle2" className={css[color]}>
                                            <ErrorIcon fontSize="small" />&nbsp;&nbsp;Similar {type}
                                        </Typography>
                                    </Grid>
                                    <Grid item alignContent="flex-end">
                                        { type === 'request' ? (<RequestStatus status={o.status} />) : (<BusinessStatus status={o.status} />) }
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h6" color="primary">{o.name}</Typography>
                            </Grid>
                        </Grid>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Grid container spacing={1}>
                            <Grid item xs={12}><Typography variant="subtitle2" color="secondary">Description</Typography></Grid>
                            <Grid item xs={12}>{o.description}</Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                            <Grid item xs={12}><Typography variant="subtitle2" color="secondary">Location information</Typography></Grid>
                            { type === 'request' && <Grid item xs={12}>{o.location}</Grid>}
                                <Grid item xs={6}>{o.address}</Grid>
                                <Grid item xs={6}>{o.npa}</Grid>
                            <Grid item xs={12}>
                                <Divider />
                            </Grid>
                            <Grid item xs={12}><Typography variant="subtitle2" color="secondary">Contact information</Typography></Grid>
                            { type === 'request' && <Grid item xs={12}>{o.contact}</Grid>}
                            <Grid item xs={4}>{o.website}</Grid>
                            <Grid item xs={4}>{o.email}</Grid>
                            <Grid item xs={4}>{o.phone}</Grid>
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            );

            index++;

        })

    });

    return (
        boxes
    )

}

export default RequestSimilars;