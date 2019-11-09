class Ajax{
    get(url, params) {
        const query = this.query(params);
        const requestUrl = query === '' ? url : `${url}?${query}`;
        
        return this.createRequest(requestUrl, 'get');
    }

    post(url, body) {
        const requestBody = typeof body === 'object' ? JSON.stringify(body) : undefined;
        
        return this.createRequest(url, 'post', requestBody);
    }

    async createRequest(url, method, body) {
        const req = new Request(url, { method, body });
        const res = await fetch(req);
        const json = await res.json();
        
        return json;
    }

    query(params = {}) {
        const query = [];
        
        for (let key in params) {
            query.push(`${key}=${params[key]}`);
        }

        return query.join('&');
    }
 }

export default new Ajax();