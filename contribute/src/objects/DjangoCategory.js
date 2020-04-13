import axios from "axios";

class DjangoCategory {

    constructor(token) {
        this.token = token;
    }

    list (search) {
        return axios.get(
            '/api/categories/',
            {
                params: {
                    offset: 0,
                    limit: 9999
                },
                headers: {
                    'Authorization': 'Token ' + this.token
                }
            }
        ).then(result => {
            return result.data.results;
        });
    }

    add (data) {
        return axios.post(
            '/api/categories/',
            data,
            {
                headers: {
                    'Authorization': 'Token ' + this.token
                }
            }
        ).then(result => result.data);
    }

}

export default DjangoCategory;