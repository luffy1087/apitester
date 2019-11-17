import ajax from './ajax';

class Api {
    getSteps() {
        return ajax.get('getSteps');
    }

    getEnvironments() {
        return ajax.get('getEnvironments');
    }
}

export default new Api();