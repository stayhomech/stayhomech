import React, {useEffect, useState} from 'react';
import { Card, CardContent, CardActions, Button, Grid, Typography, FormControl, Input, InputLabel, FormHelperText, Divider, TextField, Tooltip } from '@material-ui/core';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import { makeStyles } from '@material-ui/core/styles';
import _ from 'underscore';
import {useDispatch, useSelector} from 'react-redux';
import DjangoRequest from "../objects/DjangoRequest";
import DjangoGeo from "../objects/DjangoGeo";
import AsyncSelect from 'react-select/async';
import CategoriesChoice from './CategoriesChoice';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import Snackbar from "@material-ui/core/Snackbar";
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
    copyButton: {
        color: 'lightgray',
        '&:hover': {
            color: 'darkgrey'
        },
    },
}));

const RequestToBusiness = (props) => {

    const css = useStyles();

    const request = props.request;

    // Redux
    const dispatch = useDispatch();

    const token = useSelector(state => state.auth.token);

    // Form
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [description, setDescription] = useState('');
    const [descriptionError, setDescriptionError] = useState('');
    const [categories, setCategories] = useState([]);
    const [categoriesError, setCategoriesError] = useState('');
    const [deliversTo, setDeliversTo] = useState([]);
    const [deliversToCH, setDeliversToCH] = useState(false);
    const [deliversToError, setDeliversToError] = useState('');
    const [address, setAddress] = useState('');
    const [addressError, setAddressError] = useState('');
    const [city, setCity] = useState(null);
    const [cityId, setCityId] = useState(null);
    const [cityError, setCityError] = useState('');
    const [website, setWebsite] = useState('');
    const [websiteError, setWebsiteError] = useState('');
    const [phone, setPhone] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    // Snackbar
    const openSnackBar = (severity, message) => {
        dispatch({ type:'ASYNC.SB_OPEN', payload: { severity: severity, message: message } });
    }

    // Geodata
    const Geo = new DjangoGeo(token);

    // Extract city
    useEffect(() => {
        var npa_pk = request.location.match(/\[PK:([0-9]+)\]/);
        if (npa_pk && npa_pk.length > 1) {
            Geo.getNPA(npa_pk[1])
                .then(npa => setCityId(npa))
        }
    }, [request])

    // Pre-cleaned data
    const data = {
        name: _.unescape(request.name).trim(),
        description: _.unescape(request.description).trim(),
        address: _.unescape(request.address).trim().replace(',', ''),
        website: request.website.startsWith('http') ? request.website.trim() : 'http://' + request.website.trim(),
        phone: request.phone.startsWith('0') ? request.phone.replace(/^0/, '+41') : request.phone,
        email: request.email.trim()
    }

    const handleCancelClick = (e) => {
        e.preventDefault();
        dispatch((dispatch, getState) => {
            dispatch({ type: 'ASYNC.START' });
            const Request = new DjangoRequest(getState().auth.token);
            Request.set_status(request.uuid, DjangoRequest.status.NEW)
                .then((result) => {
                    dispatch({ type: 'REQUESTS.SET_STATUS', payload: result.new })
                    openSnackBar('info', 'Request has been un-reserved.');
                })
                .then(dispatch({ type: 'ASYNC.STOP' }))
        });
    }

    const loadCityOptions = (inputValue) =>
        Geo.getNPAs(inputValue);

    const parseDeliveryOptions = (results) => {

        const out = [];

        results.cs.forEach((c) => {
            out.push({ type: 'c', id: c.id, label: 'Canton of ' + c.name })
        });
        results.ds.forEach((c) => {
            out.push({ type: 'd', id: c.id, label: 'District of ' + c.name })
        });
        results.ms.forEach((c) => {
            out.push({ type: 'm', id: c.id, label: 'Municipality of ' + c.name })
        });
        results.ns.forEach((c) => {
            out.push({ type: 'n', id: c.id, label: c.npa + ' ' + c.name })
        });

        return out;

    }

    const loadDeliveryOptions = (inputValue) =>
        Geo.searchAll(inputValue)
            .then(parseDeliveryOptions);

    const handleDeliversToCH = () => {
        setDeliversToCH(!deliversToCH);
    }

    const handleConvertClick = () => {

        // Data
        const data = {
            name: name,
            description: description,
            main_category: categories[0],
            other_categories: categories.slice(1),
            delivers_to_ch: deliversToCH,
            deliversTo: deliversTo,
            address: address,
            location: city ? city.id : cityId ? cityId.id : null,
            website: website,
            phone: phone,
            email: email,
            parent_request: request.uuid
        }
        let has_errors = false;

        // Name
        if (!name || name === '') {
            setNameError('Name cannot be empty.');
            has_errors = true;
        } else {
            setNameError('');
        }

        // Description
        if (!description || description === '') {
            setDescriptionError('Description cannot be empty.');
            has_errors = true;
        } else {
            setDescriptionError('');
        }

        // Categories
        if (!categories || categories.length === 0) {
            setCategoriesError('At least one category must be chosen.');
            has_errors = true;
        } else {
            setCategoriesError('');
        }

        // Delivery
        if ((!deliversTo || deliversTo.length === 0) && (deliversToCH === false)) {
            setDeliversToError('At least one delivery area must be chosen');
            has_errors = true;
        } else {
            setDeliversToError('');
        }

        // Address
        if (!address || address === '') {
            setAddressError('Address cannot be empty.');
            has_errors = true;
        } else {
            setAddressError('');
        }

        // City
        if (!city && !cityId) {
            setCityError('Select a city.');
            has_errors = true;
        } else {
            setCityError('');
        }

        // Website
        if (website && website !== '' && !website.startsWith('http')) {
            setWebsiteError('Website address must start with http.');
            has_errors = true;
        } else {
            setWebsiteError('');
        }

        // Phone
        if (phone && phone !== '' && !phone.startsWith('+41')) {
            setPhoneError('Phone must start with +41.');
            has_errors = true;
        } else {
            setPhoneError('');
        }

        // Check if errors
        if (has_errors) {
            return
        }

        // Submit
        dispatch((dispatch, getState) => {
            dispatch({ type: 'ASYNC.START' });
            const Request = new DjangoRequest(getState().auth.token);
            Request.convert(data)
                .then((result) => {
                    if (result.success) {
                        openSnackBar('success', 'Request has been converted!');
                        dispatch({ type:'REQUESTS.FINISH' });
                    } else {

                        if (result.result.name) { setNameError(result.result.name) }
                        if (result.result.description) { setDescriptionError(result.result.description) }
                        if (result.result.main_category) { setCategoriesError(result.result.main_category) }
                        if (result.result.other_categories) { setCategoriesError(result.result.other_categories) }
                        if (result.result.delivers_to_ch) { setDeliversToError(result.result.delivers_to_ch) }
                        if (result.result.delivers_to_npa) { setDeliversToError(result.result.delivers_to_npa) }
                        if (result.result.delivers_to_municipality) { setDeliversToError(result.result.delivers_to_municipality) }
                        if (result.result.delivers_to_district) { setDeliversToError(result.result.delivers_to_district) }
                        if (result.result.delivers_to_canton) { setDeliversToError(result.result.delivers_to_canton) }
                        if (result.result.address) { setAddressError(result.result.address) }
                        if (result.result.location) { setCityError(result.result.location) }
                        if (result.result.website) { setWebsiteError(result.result.website) }
                        if (result.result.phone) { setPhoneError(result.result.phone) }
                        if (result.result.email) { setEmailError(result.result.email) }

                        if (result.result['__all__']) {
                            openSnackBar('error', 'An error occurred: ' + result.result['__all__']);
                        } else {
                            openSnackBar('error', 'An error occurred: ' + JSON.stringify(result.result));
                        }
                    }
                })
                .then(dispatch({ type: 'ASYNC.STOP' }))
                .catch((e) => {
                    openSnackBar('error', 'An error occurred: ' + e.toString());
                })
        });

    }

    return (
        <Card>
            <CardContent>
                <Grid container spacing={4}>
                    <Grid item xs={12}>
                        <Typography color="primary" variant="h6">New business from request</Typography>
                    </Grid>

                    {/* Name */}
                    <Grid container alignItems="center">
                        <Grid item xs={1} align="center">
                            <Tooltip title="Copy from request">
                                <a className={css.copyButton} href="#" onClick={(e) => { setName(data.name) }}><DoubleArrowIcon /></a>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={10}>
                            {nameError !== '' &&
                            <Alert severity="error">{nameError}</Alert>
                            }
                            <FormControl size="small" required fullWidth error={nameError !== ''}>
                                <InputLabel htmlFor="rtb-name">Company name</InputLabel>
                                <Input id="rtb-name" value={name} onChange={(e) => setName(e.target.value)} />
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}><Divider /></Grid>

                    {/* Description */}
                    <Grid container alignItems="center">
                        <Grid item xs={1} align="center">
                            <Tooltip title="Copy from request">
                                <a className={css.copyButton} href="#" onClick={(e) => { setDescription(data.description) }}><DoubleArrowIcon /></a>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={10}>
                            {descriptionError !== '' &&
                            <Alert severity="error">{descriptionError}</Alert>
                            }
                            <FormControl size="small" required fullWidth>
                                <TextField 
                                    id="rtb-description" 
                                    required
                                    label="Description"
                                    multiline 
                                    value={description}
                                    error={descriptionError !== ''}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}><Divider /></Grid>

                    {/* Categories */}
                    <CategoriesChoice request={request} categories={categories} setCategories={setCategories} error={categoriesError} />

                    <Grid item xs={12}><Divider /></Grid>

                    {/* Delivery */}
                    <Grid container alignItems="center" spacing={1}>
                        <Grid item xs={1} align="center">
                        </Grid>
                        <Grid item xs={3}>
                            Delivery
                        </Grid>
                        <Grid item xs={8}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={deliversToCH}
                                        onChange={handleDeliversToCH}
                                        name="delivers_to_ch"
                                        color="primary"
                                    />
                                }
                                label="Delivers to whole Switzerland"
                            />
                        </Grid>
                        <Grid item xs={1} align="center">
                        </Grid>
                        <Grid item xs={10}>
                            {deliversToError !== '' &&
                            <Alert severity="error">{deliversToError}</Alert>
                            }
                            <AsyncSelect
                                cacheOptions
                                isMulti
                                loadOptions={loadDeliveryOptions}
                                onChange={d => setDeliversTo(d)}
                                value={deliversTo}
                                getOptionValue={(o) => { return { type: o.type, id: o.id } }}
                                getOptionLabel={(o) => o.label}
                            />
                        </Grid>
                    </Grid>

                    <Grid item xs={12}><Divider /></Grid>

                    {/* Address */}
                    <Grid container alignItems="center">
                        <Grid item xs={1} align="center">
                            {data.address !== '' &&
                            <Tooltip title="Copy from request">
                                <a className={css.copyButton} href="#" onClick={(e) => {
                                    setAddress(data.address)
                                }}><DoubleArrowIcon/></a>
                            </Tooltip>
                            }
                        </Grid>
                        <Grid item xs={10}>
                            {addressError !== '' &&
                            <Alert severity="error">{addressError}</Alert>
                            }
                            <FormControl size="small" required fullWidth error={addressError !== ''}>
                                <InputLabel htmlFor="rtb-address">Address</InputLabel>
                                <Input id="rtb-address" value={address} onChange={(e) => setAddress(e.target.value)} />
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}><Divider /></Grid>

                    {/* City */}
                    <Grid container alignItems="center" spacing={1}>
                        <Grid item xs={1} align="center">
                        </Grid>
                        <Grid item xs={11} align="left">
                            City
                        </Grid>
                        <Grid item xs={1} align="center">
                        </Grid>
                        <Grid item xs={10}>
                            {cityError !== '' &&
                            <Alert severity="error">{cityError}</Alert>
                            }
                            {cityId ?
                                cityId.npa + " " + cityId.name
                                :
                                <AsyncSelect
                                    cacheOptions
                                    loadOptions={loadCityOptions}
                                    onChange={option => setCity(option)}
                                    value={[city]}
                                    getOptionValue={(o) => o.id}
                                    getOptionLabel={(o) => o.npa + ' ' + o.name}
                                />
                            }
                        </Grid>
                    </Grid>

                    <Grid item xs={12}><Divider /></Grid>

                    {/* Website */}
                    <Grid container alignItems="center">
                        <Grid item xs={1} align="center">
                            {data.website !== 'http://' &&
                            <Tooltip title="Copy from request">
                                <a className={css.copyButton} href="#" onClick={(e) => {
                                    setWebsite(data.website)
                                }}><DoubleArrowIcon/></a>
                            </Tooltip>
                            }
                        </Grid>
                        <Grid item xs={10}>
                            {websiteError !== '' &&
                            <Alert severity="error">{websiteError}</Alert>
                            }
                            <FormControl size="small" fullWidth error={websiteError !== ''}>
                                <InputLabel htmlFor="rtb-website">Website</InputLabel>
                                <Input id="rtb-website" aria-describedby="rtb-website-helper" value={website} onChange={(e) => setWebsite(e.target.value)} />
                                <FormHelperText id="rtb-website-helper">Must start with http:// or https://. Facebook pages allowed.</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}><Divider /></Grid>

                    {/* Phone */}
                    <Grid container alignItems="center">
                        <Grid item xs={1} align="center">
                            {data.phone !== '' &&
                            <Tooltip title="Copy from request">
                                <a className={css.copyButton} href="#" onClick={(e) => {
                                    setPhone(data.phone)
                                }}><DoubleArrowIcon/></a>
                            </Tooltip>
                            }
                        </Grid>
                        <Grid item xs={10}>
                            {phoneError !== '' &&
                            <Alert severity="error">{phoneError}</Alert>
                            }
                            <FormControl size="small" fullWidth error={phoneError !== ''}>
                                <InputLabel htmlFor="rtb-phone">Phone</InputLabel>
                                <Input id="rtb-phone" aria-describedby="rtb-phone-helper" value={phone} onChange={(e) => setPhone(e.target.value)} />
                                <FormHelperText id="rtb-phone-helper">Must be in international format (+41 xx xxx xx xx)</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}><Divider /></Grid>

                    {/* Email */}
                    <Grid container alignItems="center">
                        <Grid item xs={1} align="center">
                            {data.email !== '' &&
                            <Tooltip title="Copy from request">
                                <a className={css.copyButton} href="#" onClick={(e) => {
                                    setEmail(data.email)
                                }}><DoubleArrowIcon/></a>
                            </Tooltip>
                            }
                        </Grid>
                        <Grid item xs={10}>
                            {emailError !== '' &&
                            <Alert severity="error">{emailError}</Alert>
                            }
                            <FormControl size="small" fullWidth error={emailError !== ''}>
                                <InputLabel htmlFor="rtb-email">Email</InputLabel>
                                <Input id="rtb-email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>&nbsp;</Grid>

                </Grid>
            </CardContent>
            <CardActions style={{ justifyContent: 'end' }}>
                <Button size="small" color="secondary" onClick={ handleCancelClick }>Annuler</Button>
                <Button size="small" color="primary" onClick={ handleConvertClick } >Convert</Button>
            </CardActions>
        </Card>
    );

}

export default RequestToBusiness;