import React from 'react';
import { Chip } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import HelpIcon from '@material-ui/icons/Help';
import LockIcon from '@material-ui/icons/Lock';
import DoneIcon from '@material-ui/icons/Done';
import CachedIcon from '@material-ui/icons/Cached';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateIcon from '@material-ui/icons/Update';

const RequestStatus = (props) => {

    switch(parseInt(props.status)){
        case 1:
            var icon = <StarIcon />;
            var label = 'New'
            break;
        case 2:
            var icon = <LockIcon />;
            var label = 'Reserved'
            break;
        case 3:
            var icon = <DoneIcon />;
            var label = 'Handled'
            break;
        case 4:
            var icon = <CachedIcon />;
            var label = 'Updated'
            break;
        case 5:
            var icon = <DeleteIcon />;
            var label = 'Deleted'
            break;
        case 6:
            var icon = <UpdateIcon />;
            var label = 'Keepalived'
            break;
        default:
            var icon = <HelpIcon />;
            var label = 'Unknown'

    }

    return (
        <Chip variant="outlined" size="small" icon={icon} label={label} />
    );

}

export default RequestStatus;
