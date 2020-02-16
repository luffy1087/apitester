import https from 'https';

class ApiClient {
    getEndpoint(endpoint, placeholders) {
        
    }
    
    get(options) {
        //options.env
        //options.url,
        //options.endpoint
    }

    post(options) {

    }

    put(options) {

    }

    request(options, callback) {
        return https.request(this.prepareRequest(options), callback);
    }

    prepareRequest(options) {

    }

    getHeaders() {

    }
}

export default new ApiClient();