import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './reducers';

// Create a store
const storeFactory = () => {

    // Session storing
    const sessionStoreReducer = (state, action) => {

        // Empty state, try to load from session
        if (!state) {
            var sessionState = sessionStorage.getItem('state');
            if (sessionState) {
                state = JSON.parse(sessionState);
                if (state === {}) {
                    state = null;
                }
            }
        }

        // Call reducers
        const new_state = reducer(state, action);

        // Check if we have to redirect after safe
        var will_redirect = false;
        if (new_state.auth.redirect != '') {
            will_redirect = new_state.auth.redirect;
            new_state.auth.redirect = '';
        }

        // Save new state
        sessionStorage.setItem('state', JSON.stringify(new_state));

        // Redirect
        if (will_redirect) {
            window.location = will_redirect;
        }

        // Return new state
        return new_state;
    }

    // Create store itself
    const store = createStore(
        sessionStoreReducer,
        applyMiddleware(thunk),
    );

    // Return the store
    return store;

}

export default storeFactory;