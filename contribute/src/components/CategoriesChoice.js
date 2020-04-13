import React, {useEffect, useState} from 'react';
import {Grid, Input, Paper} from '@material-ui/core';
import Button from "@material-ui/core/Button";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import { makeStyles } from '@material-ui/core/styles';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import DjangoRequest from "../objects/DjangoRequest";
import DjangoCategory from "../objects/DjangoCategory";
import {useDispatch, useSelector} from "react-redux";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {all} from "underscore";
import InputAdornment from "@material-ui/core/InputAdornment";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import SearchIcon from '@material-ui/icons/Search';
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import IconButton from "@material-ui/core/IconButton";
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import { Chip, Avatar, TextField } from "@material-ui/core";
import $ from 'jquery';
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

const useStyles = makeStyles((theme) => ({
    paper: {
        minHeight: '32x',
        padding: '16px',
    },
    changeLanguage: {
        float: 'right',
        fontSize: '.8rem',
        select: {
            fontSize: '.8rem',
        },
    },
    withBorder: {
        borderRightWidth: '1px',
    },
    catList: {
        height: '50vh',
        overflowY: 'scroll'
    },
    catAdd: {
        height: '50vh',
        borderWidth: '1px',
        borderColor: theme.palette.divider,
        borderStyle: 'solid'
    },
    catAddGrid: {
        padding: '16px',
    },
    listParent: {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
    },
    listChild: {
        padding: 0,
        paddingLeft: '40px',
    },
    catChip: {
        marginRight: '8px',
        marginBottom: '8px',
    }
}));


const CategoriesChoice = (props) => {

    const css = useStyles();

    const request = props.request;

    const dispatch = useDispatch();

    const [allCategories, setAllCategories] = useState({});
    const [parentCategories, setParentCategories] = useState([]);
    const [childCategories, setChildCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(props.categories);
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState('')
    const [visibleCategories, setVisibleCategories] = useState([]);
    const [addOpen, setAddOpen] = useState(false);

    const lang = useSelector(state => state.auth.lang);
    const token = useSelector(state => state.auth.token);

    const [list, setList] = useState([]);
    const [selected_list, set_selected_list] = useState([]);

    const [addParent, setAddParent] = useState("null");
    const [addEN, setaddEN] = useState(undefined);
    const [addDE, setAddDE] = useState(undefined);
    const [addFR, setAddFR] = useState(undefined);
    const [addIT, setAddIT] = useState(undefined);
    const [addError, setAddError] = useState(undefined);

    // Snackbar
    const openSnackBar = (severity, message) => {
        dispatch({ type:'ASYNC.SB_OPEN', payload: { severity: severity, message: message } });
    }

    const loadCategories = () => {
        return dispatch((dispatch, getState) => {
            dispatch({ type: 'ASYNC.START' });
            const Category = new DjangoCategory(getState().auth.token);
            return Category.list()
                .then((result) => {

                    // All categories
                    const all = {};
                    var children = [];
                    var parents = [];
                    result.forEach((category) => {
                        all[category.id] = category;
                        if (category.parent === null) {
                            parents.push(category.id);
                        } else {
                            children.push(category.id);
                        }
                    });
                    setAllCategories(all);
                    setVisibleCategories(children);

                    // Sort
                    const sortCategories = (a, b) => {
                        var name_a = all[a]['name_' + lang];
                        var name_b = all[b]['name_' + lang];
                        if (name_a) {
                            return name_a.localeCompare(name_b);
                        } else {
                            return -1;
                        }
                    }
                    parents = parents.sort(sortCategories);
                    children = children.sort(sortCategories);

                    // Save
                    setParentCategories(parents);
                    setChildCategories(children);

                })
                .then(dispatch({ type: 'ASYNC.STOP' }))
        });

    }

    const handleOpen = () => {
        setAddOpen(false);
        setAddError(undefined);
        setAddParent('null');
        setaddEN(undefined);
        setAddDE(undefined);
        setAddFR(undefined);
        setAddIT(undefined);
        loadCategories()
            .then(setOpen(true));
    }

    const handleClose = () => {
        setAddOpen(false);
        setAddError(undefined);
        setAddParent('null');
        setaddEN(undefined);
        setAddDE(undefined);
        setAddFR(undefined);
        setAddIT(undefined);
        setOpen(false);
    }

    const handleLanguageChange = (event) => {
        setAddOpen(false);
        setAddError(undefined);
        setAddParent('null');
        setaddEN(undefined);
        setAddDE(undefined);
        setAddFR(undefined);
        setAddIT(undefined);
        dispatch({ type: 'AUTH.LANG', payload: event.target.value });
    }

    const handleChangeFilter = (e) => {
        const v = e.target.value;
        setFilter(v);
        if (v === '' && selectedCategories.length === 0) {
            setVisibleCategories(childCategories);
        } else {
            const visible = [];
            childCategories.forEach((child) => {
                if (selectedCategories.includes(child)) {
                    return;
                }
                var name = allCategories[child]['name_' + lang];
                if (!name)
                    name = allCategories[child]['name'];
                name = name.toLocaleLowerCase();
                if (name.includes(v.toLocaleLowerCase())) {
                    visible.push(child);
                }
            })
            setVisibleCategories(visible);
        }
    }

    const handleAddCategory = (id) => {
        const c = [...selectedCategories, id];
        setSelectedCategories(c);
        props.setCategories(c);
    }

    const handleRemoveCategory = (id) => {
        const c = selectedCategories.filter(cat => cat !== id);
        setSelectedCategories(c);
        props.setCategories(c);
    }

    const handleCreateCategory = (e) => {

        // Parent
        if (!addParent || addParent === 'null') {
            return setAddError('Please select a parent category.');
        }

        // Translations
        if (!addEN || addEN === '' || !addDE || addDE === '' || !addFR || addFR === '' || !addIT || addIT === '') {
            return setAddError('Please enter all category names.');
        }

        // Post
        const Category = new DjangoCategory(token);
        Category.add({
            parent: addParent,
            name: addEN,
            name_en: addEN,
            name_de: addDE,
            name_fr: addFR,
            name_it: addIT,
        }).then((result) => {

            // Add new category to list
            const new_c = {};
            new_c[result.id] = result;
            const c = Object.assign({}, allCategories, new_c)
            setAllCategories(c);

            // Select new category
            handleAddCategory(result.id);

            // Clear state
            setAddOpen(false);
            setAddError(undefined);
            setAddParent('null');
            setaddEN(undefined);
            setAddDE(undefined);
            setAddFR(undefined);
            setAddIT(undefined);

            // Reload categories
            loadCategories();

            // Inform user
            openSnackBar('success', 'Category added.')

        }).catch((e) => {

            // Inform user
            openSnackBar('error', 'Cannot add category, an error occurred: ' + e.toString());

        })
    }

    useEffect(() => {

        if (open) {

            var list = [];
            var selected_list = [];

            parentCategories.forEach((parent) => {
                list.push(<ListItem key={parent} dense={true}
                                    className={css.listParent}>{allCategories[parent]['name_' + lang]}</ListItem>);
                const children = [];
                childCategories.forEach((child) => {
                    if (allCategories[child].parent === parent && visibleCategories.includes(child) && !selectedCategories.includes(child)) {
                        children.push(<ListItem dense={true} divider={true} key={child} className={css.listChild} button onClick={(e) => {
                            handleAddCategory(child);
                        }}>
                            <ListItemText
                                primary={allCategories[child]['name_' + lang]}
                            />
                            <ListItemIcon>
                                <IconButton edge="end" aria-label="Add">
                                    <ChevronRightIcon/>
                                </IconButton>
                            </ListItemIcon>
                        </ListItem>);
                    }
                });
                list.push(<List key={parent + '_children'} dense={true}>{children}</List>);
            })

            selectedCategories.forEach((category) => {
                selected_list.push(<ListItem key={category} dense={true} divider button onClick={(e) => {
                    handleRemoveCategory(category);
                }}>
                    <ListItemIcon>
                            <ChevronLeftIcon/>
                    </ListItemIcon>
                    <ListItemText
                        primary={allCategories[allCategories[category].parent]['name_' + lang] + ' / ' + allCategories[category]['name_' + lang]}
                    />
                </ListItem>);
            });

            setList(list);
            set_selected_list(selected_list);

        }

    }, [parentCategories, selectedCategories, visibleCategories, allCategories, childCategories, open, filter, lang])

    const chips = [];
    var first = true;
    props.categories.forEach((category) => {
        var label = allCategories[allCategories[category].parent]['name_' + lang] + ' / ' + allCategories[category]['name_' + lang];
        if (first) {
            chips.push(<Chip key={category} label={label} size="small" className={css.catChip} />);
            first = false;
        } else {
            chips.push(<Chip key={category} variant="outlined" label={label} size="small" className={css.catChip} />)
        }
    })

    return (
        <Grid container spacing={2} alignItems="center">
            <Grid item xs={1}></Grid>
            <Grid item xs={3}>
                Categories
            </Grid>
            <Grid item xs={8}>
                <Button onClick={handleOpen}><AddCircleIcon /></Button>
            </Grid>
            <Grid item xs={1}></Grid>
            <Grid item xs={10}>
                {props.error !== '' &&
                    <Alert severity="error">{props.error}</Alert>
                }
                <Paper variant="outlined" className={css.paper}>
                    {props.categories.length === 0 ?
                        <Typography variant="caption">No category selected...</Typography>
                        :
                        chips
                    }
                </Paper>
            </Grid>
            <Dialog
                fullWidth={true}
                maxWidth='md'
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>
                    Select categories
                    <span className={css.changeLanguage}>
                        See categories in:&nbsp;&nbsp;
                        <Select
                            value={lang}
                            onChange={handleLanguageChange}
                        >
                            <MenuItem value='en'>English</MenuItem>
                            <MenuItem value='de'>German</MenuItem>
                            <MenuItem value='fr'>French</MenuItem>
                            <MenuItem value='it'>Italian</MenuItem>
                        </Select>
                    </span>
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="input-search">Filter</InputLabel>
                                <Input
                                    id="input-search"
                                    value={filter}
                                    onChange={ handleChangeFilter }
                                    startAdornment={<InputAdornment position="start"><SearchIcon /></InputAdornment>}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} >
                            <Grid container justify="flex-end">
                                <Button onClick={() => { setAddOpen(!addOpen); }}>
                                    <AddCircleIcon />
                                    &nbsp;&nbsp;
                                    Add new category
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <Paper className={css.catList} variant="outlined" square>
                                <List>
                                    {list}
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item xs={6}>
                            {addOpen ?
                                <div className={css.catAdd}>
                                    <form id="add-category-form">
                                        <Grid container spacing={2} className={css.catAddGrid}>
                                            {addError &&
                                                <Grid item xs={12}>
                                                    <Alert severity="warning">{addError}</Alert>
                                                </Grid>
                                            }
                                            <Grid item xs={6}>
                                                Parent category
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Select required fullWidth id="add-category-parent" value={addParent} onChange={(e) => { setAddParent(e.target.value) }}>
                                                    <MenuItem key="null" value="null" >----</MenuItem>
                                                    {parentCategories.map((parent) =>
                                                        <MenuItem key={parent} value={parent}>{allCategories[parent]['name_' + lang]}</MenuItem>
                                                    )}
                                                </Select>
                                            </Grid>
                                            <Grid item xs={3}>
                                                Name
                                            </Grid>
                                            <Grid item xs={3}>
                                                English
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField id="add-category-en" required value={addEN} onChange={(e) => { setaddEN(e.target.value) }} />
                                            </Grid>
                                            <Grid item xs={3}/>
                                            <Grid item xs={3}>
                                                German
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField id="add-category-de" required value={addDE} onChange={(e) => { setAddDE(e.target.value) }} />
                                            </Grid>
                                            <Grid item xs={3}/>
                                            <Grid item xs={3}>
                                                French
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField id="add-category-fr" required value={addFR} onChange={(e) => { setAddFR(e.target.value) }} />
                                            </Grid>
                                            <Grid item xs={3}/>
                                            <Grid item xs={3}>
                                                Italian
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField id="add-category-it" required value={addIT} onChange={(e) => { setAddIT(e.target.value) }} />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button color="primary" onClick={ handleCreateCategory }>Add category</Button>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </div>
                                :
                                <Paper className={css.catList} variant="outlined" square>
                                    <List>
                                        {selected_list}
                                    </List>
                                </Paper>
                            }
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Grid>
    )

}

export default CategoriesChoice;