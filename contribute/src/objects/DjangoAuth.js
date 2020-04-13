import axios from 'axios';

class DjangoAuth {

    // Perform authentication and return token
    async authenticate (username, password) {
        return axios.post(
            '/api-token-auth/',
            {
                username: username,
                password: password
            }
        )
        .then(result => {
            if ('data' in result && 'token' in result.data) {
                return result.data
            } else {
                throw new Error('Missing data in result.')
            }
        })
        .catch(e => {
            throw new Error('Cannot authenticate. Check username and password.')
        })
        .then(data => {
            return axios.get(
                '/api/user/42/',
                {
                    headers: {
                        'Authorization': 'Token ' + data.token
                    }
                }
            )
            .then(result => {
                data.user = {};
                Object.assign(data.user, result.data);
                return data;
            })
            .catch(e => {
                throw new Error('Cannot retrieve user details.');
            })
        });
    }

}

export default DjangoAuth;
