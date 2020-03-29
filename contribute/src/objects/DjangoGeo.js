import axios from "axios";

class DjangoGeo {

    constructor(token) {
        this.token = token;
    }

    getGeoData (type, search='') {

        var url = '/api/' + type + '/';
        if (search !== '') {
            url += 'search/'
        }

        var params = {
            limit: 9999,
            offset: 0
        }
        if (search !== '') {
            params.search = search;
        }

        return axios.get(
            url,
            {
                params: params,
                headers: {
                    'Authorization': 'Token ' + this.token
                }
            }
        ).then(result => {
            return result.data;
        });
    }

    getGeoDataObject (type, pk) {
        return axios.get(
            '/api/' + type + '/' + pk + '/',
            {
                headers: {
                    'Authorization': 'Token ' + this.token
                }
            }
        ).then(result => {
            return result.data;
        });
    }

    searchAll (search) {
        return axios.get(
            '/api/npas/search_all/',
            {
                params: {
                    search: search
                },
                headers: {
                    'Authorization': 'Token ' + this.token
                }
            }
        ).then(result => {
            return result.data;
        });
    }

    getNPAs (search) {
        return this.getGeoData('npas', search);
    }

    getNPA (pk) {
        return this.getGeoDataObject('npas', pk)
    }

    getMunicipalities (search) {
        return this.getGeoData('municipalities', search);
    }

    getDistricts (search) {
        return this.getGeoData('districts', search);
    }

    getCantons (search) {
        return this.getGeoData('cantons', search);
    }

}

export default DjangoGeo;