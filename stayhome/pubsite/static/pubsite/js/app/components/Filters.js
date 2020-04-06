import React, { useContext, useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faSearchPlus, faSearchMinus, faDotCircle } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { Slider, Tooltip, withStyles, Grid } from '@material-ui/core';
import $ from 'jquery';

import { CategoryTree } from './CategoryTree';


const SearchContext = React.createContext({
    filters: {
        text: '',
        distance: Infinity,
        category: 0,
    },
    setFilters: {
        setText: () => {},
        setDistance: () => {},
        setCategory: () => {}
    }
});

const ValueLabelComponent = props => {

    const { children, open, value } = props;
  
    return (
      <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    )

}

const SHSlider = withStyles({
    root: {
      color: '#308a57'
    },
})(Slider);

const distance_to_string = (v) => {
    if (v < 2) {
        v = Math.round(v * 10) * 100;
        return v.toString() + " m";
    } else if (v < 10) {
        return parseFloat(v).toFixed(1).toString() + " km";
    } else {
        return Math.round(v).toString() + " km";
    }
}

const Filters = props => {

    const { t, i18n } = useTranslation();

    const searchContext = useContext(SearchContext);

    const handleTextFilterChange = (e) => {
        e.preventDefault();
        searchContext.setFilters.setText(e.target.value);
    }

    const handleDistanceFilterChange = (e, value) => {
        searchContext.setFilters.setDistance(distance_to_km(value, props.radius.min, props.radius.max));
    }

    const toggleFilters = (e) => {
        e.preventDefault();
        $('.nav-filter').toggle();
    }

    const distance_to_km = (value, min, max) => {
        var f = Math.pow(value / 100.0, 3);
        return min + (f * (max - min));
    }

    const valueLabelFormatHandler = (v) => {
        return distance_to_string(distance_to_km(v, props.radius.min, props.radius.max));
    }

    return (
        <div className="col-xs-12 col-md-3 px-3" id="left-nav">
            <div className="row border-bottom p-3">
                <div className="col-10 col-md-12 p-0">
                    <div className="input-group input-group-sm">
                        <div className="input-group-prepend">
                            <span className="input-group-text"><FontAwesomeIcon icon={faSearch}></FontAwesomeIcon></span>
                        </div>
                        <input className="form-control form-control-sm" type="text" placeholder={t('Search in results')} onChange={ handleTextFilterChange } />
                    </div>
                </div>
                <div className="col-2 col-md-0 px-3 d-md-none">
                    <button className="sh-filter-toggle" type="button" onClick={ toggleFilters }>
                        <FontAwesomeIcon icon={faFilter}></FontAwesomeIcon>
                    </button>
                </div>
            </div>
            <div className="row border-bottom nav-filter px-3 pt-3">
                <Grid container>
                    <Grid item>
                        <FontAwesomeIcon icon={faDotCircle} size="xs" className="m-2"></FontAwesomeIcon>
                    </Grid>
                    <Grid item xs>
                        <SHSlider
                            min={0} 
                            max={100}
                            step={1}
                            onChangeCommitted={ handleDistanceFilterChange } 
                            valueLabelDisplay="auto" 
                            ValueLabelComponent={ ValueLabelComponent }
                            valueLabelFormat={ valueLabelFormatHandler }
                            defaultValue={Math.round((searchContext.filters.distance - props.radius.min) / (props.radius.max - props.radius.min) * 100)}
                        />
                    </Grid>
                    <Grid item>
                        <FontAwesomeIcon icon={faDotCircle} size="lg" className="m-2"></FontAwesomeIcon>
                    </Grid>
                </Grid>
            </div>
            <div className="row p-0 nav-filter">
                <CategoryTree categories={ props.categoriesTree }></CategoryTree>
            </div>
        </div>
    )

}

export {
    Filters,
    SearchContext,
    distance_to_string
}