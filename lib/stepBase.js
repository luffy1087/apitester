import websocket from './webSocket';
import apiRequest from './http';

class StepBase {  
    constructor(env, previousData = {}) {
        this.data = previousData;
        this.env = this.getEnvironment(env);
    }

    get ws() {
        return websocket;
    }

    get apiRequest() {
        return apiRequest;
    }

    getEnvironment(env) {
        return require(`../env/${env}`);
    }

    getEndpoint(endpointKey) {
        const endpoint = this.env.Endpoints.find(ep => endpointKey === ep.Key).Value;
        const endpointPlaceholders = Array.from(endpoint.matchAll(/\$\{([a-zA-Z_]+)\}/g));
        const placeholders = (this.env.Placeholders || []).reduce((prevValue, ph) => {
            prevValue[ph.Key] = ph.Value;

            return prevValue;
        }, {});

        return endpointPlaceholders.reduce((prevValue, currentValue) => prevValue.replace(currentValue[0], placeholders[currentValue[1]]), endpoint);
    }
}


// class Login extends StepBase {
    
//     constructor(env) {
//         super(env);
//     }

//     do() {
//         this.
//     }
// }