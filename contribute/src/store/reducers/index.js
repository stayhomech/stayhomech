import { combineReducers } from 'redux'
import auth from "./auth";
import requests from "./requests";
import async from "./async";

export default combineReducers({
    requests,
    async,

    // Must be last !
    auth,
})