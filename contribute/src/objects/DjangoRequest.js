import axios from "axios";

class DjangoRequest {

    constructor(token) {
        this.token = token;
    }

    // Status
    static status = {
        VOID: 0,
        NEW: 1,
        RESERVED: 2,
        HANDLED: 3,
        UPDATED: 4,
        DELETED: 5,
        KEEPALIVE: 6
    }

    // Source
    static source = {
        MANUAL: 0,
        WEBFORM: 1,
        API: 2
    }

    async get_stats (dispatch) {
        this.stats()
            .then((stats) => {
                dispatch({ type: "REQUESTS.STATS", payload: stats });
            });

    }
    
    // Get requests stats
    async stats () {
        return axios.get(
            '/api/requests/stats/',
            {
                headers: {
                    'Authorization': 'Token ' + this.token
                }
            }
        ).then(result => {
            return result.data;
        });
    }

    // Get requests list
    async list (filters, pagination) {

        // Filters
        var params = {};
        if (filters.lang !== '*') {
            params['lang'] = filters.lang
        }
        if (filters.status !== '*') {
            params['status'] = filters.status
        }
        if (filters.source !== '*') {
            params['source'] = filters.source
        }
        if (filters.source_uuid !== '*') {
            params['source_uuid__startswith'] = filters.source_uuid
        }

        // Pagination
        params = Object.assign(params, pagination);

        return axios.get(
            '/api/requests/',
            {
                params: params,
                headers: {
                    'Authorization': 'Token ' + this.token
                }
            }
        ).then(result => result.data.results);
    }

    // Get request details
    async get (uuid) {
        return axios.get(
            '/api/requests/' + uuid,
            {
                headers: {
                    'Authorization': 'Token ' + this.token
                }
            }
        ).then((res) => {
            return res.data;
        });
    }

    // Find similar businesses
    async find_similar (uuid) {
        return axios.get(
            '/api/requests/' + uuid + '/find_similar/',
            {
                headers: {
                    'Authorization': 'Token ' + this.token
                }
            }
        );
    }

    // Change request status
    async set_status (uuid, new_status, reason='') {
        return axios.post(
            '/api/requests/' + uuid + '/set_status/',
            {
                status: new_status,
                reason: reason
            },
            {
                headers: {
                    'Authorization': 'Token ' + this.token
                }
            }
        ).then(result => result.data);
    }

    // Convert to business
    async convert (data) {
        return axios.post(
            '/api/services/convert/',
            data,
            {
                headers: {
                    'Authorization': 'Token ' + this.token
                }
            }
        ).then(result => result.data);
    }

}

export default DjangoRequest;
