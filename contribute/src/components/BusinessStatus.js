import React from 'react';
import { Chip } from '@material-ui/core';
import BusinessIcon from '@material-ui/icons/Business';
import HelpIcon from '@material-ui/icons/Help';
import DeleteIcon from '@material-ui/icons/Delete';

const BusinessStatus = (props) => {

    switch(parseInt(props.status)){
        case 1:
            var icon = <BusinessIcon />;
            var label = 'Active'
            break;
        case 2:
            var icon = <DeleteIcon />;
            var label = 'Deleted'
            break;
        default:
            var icon = <HelpIcon />;
            var label = 'Unknown'

    }

    return (
        <Chip variant="outlined" size="small" icon={icon} label={label} />
    );

}

export default BusinessStatus;
