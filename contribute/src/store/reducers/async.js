// Initial state
const initState = {
    running: false,
    sb: {
        open: false,
        severity: 'success',
        message: '',
    }
}

// Reducer
const async = (state=initState, action) => {

    // Action prefix
    const prefix = 'ASYNC' + '.';

    // Handle actions
    switch (action.type) {

        // Start
        case prefix + 'START':
            return Object.assign({}, state, {
                running: true
            });

        // Stop
        case prefix + 'STOP':
            return Object.assign({}, state, {
                running: false
            });

        // Snackbar
        case prefix + 'SB_OPEN':
            return Object.assign({}, state, {
                sb: Object.assign(state.sb, action.payload, { open: true })
            });
        case prefix + 'SB_CLOSE':
            return Object.assign({}, state, {
                sb: Object.assign(state.sb,{ open: false })
            });

    }

    // Return current state
    return state;

}

export default async;