import ajax from './ajax';

class Api {
    getSteps(dirToRead) {
        return ajax.get('getSteps', { query: { dirToRead} });
    }

    getEnvironments() {
        return ajax.get('getEnvironments');
    }

    addStepOrScenario() {
        return ajax.get('addStepOrScenario');
    }

    savePipeline(steps) {
        return ajax.post('savePipeline', { steps });
    }
}

export default new Api();