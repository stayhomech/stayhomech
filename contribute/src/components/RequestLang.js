import React from 'react';
import { Chip, Avatar } from '@material-ui/core';
import {
    IconFlagFR, 
    IconFlagUS, 
    IconFlagDE, 
    IconFlagIT
 } from 'material-ui-flags';

const RequestLang = (props) => {

    switch(props.lang){
        case 'fr':
            var icon = <IconFlagFR />;
            var label = 'French'
            break;
        case 'de':
            var icon = <IconFlagDE />;
            var label = 'German'
            break;
        case 'it':
            var icon = <IconFlagIT />;
            var label = 'Italian'
            break;
        default:
            var icon = <IconFlagUS />;
            var label = 'English'
    }

    return (
        <Chip variant="outlined" size="small" avatar={<Avatar>{icon}</Avatar>} label={label} />
    )

}

export default RequestLang;
