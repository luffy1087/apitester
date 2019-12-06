import ajax from './ajax';

class Api {
    getSteps() {
        return ajax.get('getSteps');
    }

    getEnvironments() {
        return ajax.get('getEnvironments');
    }

    addStepOrScenario() {
        return ajax.get('addStepOrScenario');
    }
}

export default new Api();