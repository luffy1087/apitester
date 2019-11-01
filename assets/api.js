import ajax from './ajax';

class Api {
    getSteps() {
        return ajax.get(this.getUrl('getSteps'));
    }

    getEnvironments() {
        return ajax.get(this.getUrl('getEnvironments'));
    }

    getEnvironmentDetails(environment) {
        return ajax.get(this.getUrl('getEnvironmentDetails'), { environment });
    }

    getUrl(uri) {
        return `http://localhost:7777/${uri}`;
    }
}

export default new Api();