import apiClient from './apiClient';
import webSocket from './webSocket';

class StepsRunner {
    constructor(steps, env) {
        if (!Array.isArray(steps)) {
            throw new TypeError('steps is not well-formed!');
        }
        if (typeof env !== 'string' || env.length === 0) {
            throw new TypeError('env is not well-formed');
        }
        this.env = this.getEnvironment(env);
        this.stepClasses = this.getStepsClass(steps);
    }

    getStepsClass(steps) {
        return steps.map(path => require(path));
    }
    
    getEnvironment(env) {
        return require(`../env/${env}`);
    }

    executeSteps() {
        const data = { responses: {} };
        webSocket.send(`::Clear::`); //Clear TextArea
        for (let Class of this.stepClasses) {
            webSocket.send(`::Info::(Execution of ${Class.name})`);
            const step = new Class(apiClient, webSocket, this.env, data);
            step.execute();
            webSocket.send(`::Info::(Step ${Class.name}) Was Executed`);
        }
    }
}