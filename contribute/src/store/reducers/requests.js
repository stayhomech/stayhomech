// Initial state
const initState = {
    stats: {
        total: null,
        new: null,
        updated: null,
        drafts: null
    },
    filters: {
        status: '*',
        source: '*',
        source_uuid: '*',
        lang: '*'
    },
    pagination: {
        offset: 0,
        limit: 10,
    },
    list: [],
    count: 0,
    selected: null,
    status: null
}

// Reducer
const requests = (state=initState, action) => {

    // Action prefix
    const prefix = 'REQUESTS' + '.';

    // Handle actions
    switch (action.type) {

        // Load requests list
        case prefix + 'LIST':
            return Object.assign({}, state, {
                list: action.payload.results,
                count: action.payload.count
            });

        // Set stats
        case prefix + 'STATS':
            return Object.assign({}, state, {
                stats: action.payload
            });

        // Update filters
        case prefix + 'FILTERS':
            return Object.assign({}, state, {
                filters: Object.assign({}, state.filters, action.payload),
                pagination: Object.assign({}, state.pagination, { offset: 0 }),
                selected: null,
                status: null
            });

        // Update pagination
        case prefix + 'PAGINATION':
            return Object.assign({}, state, {
                pagination: Object.assign({}, state.pagination, action.payload),
                selected: null,
                status: null
            });

        // Select a request
        case prefix + 'SELECT':
            return Object.assign({}, state, {
                selected: action.payload,
                status: action.payload ? action.payload.status : null
            });

        // Change selected request status
        case prefix + 'SET_STATUS':
            return Object.assign({}, state, {
                selected: Object.assign(state.selected, {
                    status: action.payload
                }),
                status: action.payload
            });

        // Finish handling
        case prefix + 'FINISH':
            return Object.assign({}, state, {
                selected: null,
                status: null,
                filters: Object.assign({}, state.filters)
            })

    }

    // Return current state
    return state;

}

export default requests;
