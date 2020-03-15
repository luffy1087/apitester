class StepBase {  
    constructor(apiClient, webSocket, env, previousData = {}) {
        this.apiClient = apiClient;
        this.webSocket = webSocket;
        this.env = env;
        this.data = previousData;
    }

    get ws() {
        return this.webSocket;
    }

    get apiClient() {
        return this.apiClient;
    }

    get data() {
        return this.data;
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