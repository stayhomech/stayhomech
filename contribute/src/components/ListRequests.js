import React, { useState, useEffect } from 'react';
import { useRouteMatch, useParams } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Alert from '@material-ui/lab/Alert';
import Pagination from '@material-ui/lab/Pagination';
import { Card, CardContent, Typography, Paper, InputBase, NativeSelect, Hidden } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import DjangoRequest from '../objects/DjangoRequest';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import RequestCard from './RequestCard';
import RequestCardDetails from './RequestCardDetails';
import RequestSimilars from './RequestSimilars';
import RequestToBusiness from './RequestToBusiness';

const FilterInput = withStyles((theme) => ({
    input: {
        border: 0,
        margin: 0,
        padding: 0,
        fontSize: '14px',
        fontWeight: 500,
        backgroundColor: 'white',
        '&:hover': {
            outline: 0,
            backgroundColor: 'white',
        }
    },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
    filters: {
        padding: 0,
        display: 'flex',
    },
    filter: {
        borderRight: '1px solid #e9ebee',
        padding: theme.spacing(1),
        marginLeft: theme.spacing(1),
        display: 'flex',
        flexWrap: 'nowrap',
        verticalAlign: 'middle'
    },
    filterSelect: {
        marginLeft: theme.spacing(2),
        border: 0,
        fontSize: '14px',
    },
    paginationPaper: {
        textAlign: 'center',
        padding: theme.spacing(1),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    requestsPerPage: {
        display: 'flex',
        flexWrap: 'nowrap',
        verticalAlign: 'middle'
    },
    cardFloat: {
        float: 'right',
    },
}));

const ListRequests = (props) => {

    const css = useStyles();

    var { status } = useParams();

    // Global state
    const token = useSelector(state => state.auth.token);
    const filters = useSelector((state) => state.requests.filters);
    const pagination = useSelector(state => state.requests.pagination);
    const requests = useSelector(state => state.requests.list);
    const requests_count = useSelector(state => state.requests.count);
    const selected = useSelector(state => state.requests.selected);
    const selected_status = useSelector(state => state.requests.status);
    const stats = useSelector(state => state.requests.stats);
    const dispatch = useDispatch();

    // Local state
    const [requestsPage, setRequestsPage] = useState(1);
    const [sourceApiSelected, setSourceApiSelected] = useState(filters.source === 2);

    // Detect change of page
    let newStatusFilter = filters.status;
    switch (status) {
        case 'pending':
            newStatusFilter = DjangoRequest.status.NEW;
            break;
        case 'updated':
            newStatusFilter = DjangoRequest.status.UPDATED;
            break;
        case 'draft':
            newStatusFilter = DjangoRequest.status.RESERVED;
            break;
        default:
            newStatusFilter = DjangoRequest.status.NEW;
    }
    if (newStatusFilter !== filters.status) {
        dispatch({ type: 'REQUESTS.FILTERS', payload: Object.assign(filters, { status: newStatusFilter }) });
    }

    // Load list of requests
    useEffect(() => {
        function getList () {
            dispatch({ type: 'ASYNC.START' });
            dispatch((dispatch, getState) => {
                const Request = new DjangoRequest(token);
                Request.list(filters, pagination)
                    .then((requests) => {
                        dispatch({ type: 'REQUESTS.LIST', payload: requests });
                        dispatch({ type: 'ASYNC.STOP' });
                    })
            });
        }
        getList();
    }, [filters, pagination, token, status]);

    const handleFilterLang = (e) => {
        e.preventDefault();
        const v = (e.target.value !== '') ? e.target.value : null;
        dispatch({ type: 'REQUESTS.FILTERS', payload: { lang: v } });
    }

    const handleFilterSource = (e) => {
        e.preventDefault();
        const v = (e.target.value !== '') ? e.target.value : null;
        if (parseInt(v) === 2) {
            setSourceApiSelected(true);
        } else {
            setSourceApiSelected(false);
        }
        dispatch({ type: 'REQUESTS.FILTERS', payload: { source: v, source_uuid: null } });
    }

    const handleFilterAPISource = (e) => {
        e.preventDefault();
        const v = (e.target.value !== '') ? e.target.value : null;
        dispatch({ type: 'REQUESTS.FILTERS', payload: { source_uuid: v } });
    }
    
    const handleRequestsPerPage = (e) => {
        e.preventDefault();
        setRequestsPage(1);
        dispatch({ type: 'REQUESTS.PAGINATION', payload: { offset: 0, limit: e.target.value } });
    }

    const handleChangePage = (e, page) => {
        e.preventDefault();
        setRequestsPage(page);
        dispatch({ type: 'REQUESTS.PAGINATION', payload: { offset: (page - 1) * pagination.limit, limit: pagination.limit } });
    }

    return (
        <div id="content">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper variant="outlined" className={css.filters}>
                        <Typography className={css.filter} variant="subtitle2" color="textSecondary">:: FILTERS</Typography>
                        <div className={css.filter}>
                            <Typography variant="subtitle2" color="textSecondary">Language</Typography>
                            <NativeSelect 
                                className={css.filterSelect} 
                                onChange={handleFilterLang}
                                value={filters.lang}
                                input={ <FilterInput value={filters.lang} /> }
                            >
                                <option value="*">Any</option>
                                <option value="de">German</option>
                                <option value="fr">French</option>
                                <option value="en">English</option>
                                <option value="it">Italian</option>
                            </NativeSelect>
                        </div>
                        <div className={css.filter}>
                            <Typography variant="subtitle2" color="textSecondary">Source</Typography>
                            <NativeSelect 
                                className={css.filterSelect} 
                                onChange={handleFilterSource}
                                value={filters.source}
                                input={ <FilterInput value={filters.source} /> }
                            >
                                <option value="*">Any</option>
                                <option value={0}>Manual</option>
                                <option value={1}>Web form</option>
                                <option value={2}>API</option>
                            </NativeSelect>
                        </div>
                        {sourceApiSelected &&
                        <div className={css.filter}>
                            <Typography variant="subtitle2" color="textSecondary">API provider</Typography>
                            <NativeSelect 
                                className={css.filterSelect} 
                                onChange={handleFilterAPISource}
                                input={ <FilterInput value={filters.source_uuid} /> }
                            >
                                <option value="*">Any</option>
                                <option value="DerBund-">Der Bund / Tagesanzeiger</option>
                                <option value="aargauerzeitung-">Aargauer Zeitung</option>
                                <option value="laedelishop-">Lädelishop</option>
                            </NativeSelect>
                        </div>
                        }
                    </Paper>
                </Grid>
                {(!requests_count || requests_count === 0) ? (
                    <Grid item xs={12}>
                        <Alert severity="warning">No request to display, update your filters.</Alert>
                    </Grid>
                ):(
                    <>
                    <Grid item xs={4}>
                        <Grid container spacing={1}>
                            {(stats.new > pagination.limit) &&
                                <Grid item xs={12}>
                                    <Paper className={css.paginationPaper}>
                                        <Pagination count={Math.ceil(requests_count / pagination.limit)} page={requestsPage} shape="rounded" size="small" onChange={ handleChangePage } />
                                        <div className={css.requestsPerPage}>
                                            <Typography variant="subtitle2" color="textSecondary">Requests per page: </Typography>
                                            <NativeSelect
                                                className={css.filterSelect} 
                                                onChange={ handleRequestsPerPage }
                                                value={pagination.limit}
                                                input={ <FilterInput value={pagination.limit} /> }
                                            >
                                                <option value={10}>10</option>
                                                <option value={20}>20</option>
                                                <option value={50}>50</option>
                                                <option value={100}>100</option>
                                            </NativeSelect>
                                        </div>
                                    </Paper>
                                </Grid>
                            }
                            {requests.map((request) => (
                                <Grid item xs={12} key={request.uuid}>
                                    <RequestCard request={request} />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                    <Grid item xs={4}>
                        {selected && (
                            <RequestCardDetails 
                                request={selected}
                            />
                        )}
                    </Grid>
                    <Grid item xs={4}>
                        {selected_status === DjangoRequest.status.RESERVED ?
                            <RequestToBusiness request={selected} />
                        : selected && (
                            <RequestSimilars request={selected} />
                        )}
                    </Grid>
                    </>
                )}
            </Grid>
        </div>
    )

}

export default ListRequests;
