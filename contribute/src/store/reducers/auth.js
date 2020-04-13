// Initial state
const initState = {
    authenticated: false,
    token: null,
    user: {
        id: null,
        last_login: null,
        first_name: null,
        last_name: null,
        email: null
    },
    lang: 'en',
    redirect: null,
}

// Reducer
const auth = (state=initState, action) => {

    // Action prefix
    const prefix = 'AUTH' + '.';

    // Handle actions
    switch (action.type) {

        // Login
        case prefix + 'LOGIN':
            return Object.assign({}, state, {
                authenticated: true,
                token: action.payload.token,
                user: action.payload.user,
                redirect: '/contribute',
            });

        // Logout
        case prefix + 'LOGOUT':

            // Clear session and go to login
            sessionStorage.setItem('state', null);
            return Object.assign({}, initState, {
                redirect: '/contribute/login',
            });

        // Change language
        case prefix + 'LANG':
            return Object.assign({}, state, {
                lang: action.payload,
            });

    }

    // Return current state
    return state;

}

export default auth;