class Ajax{
    get(url, data = {}) {
        const query = this.query(data.query);
        const requestUrl = query === '' ? this.getUrl(url) : `${this.getUrl(url)}?${query}`;
        
        return this.createRequest(requestUrl, 'get', data);
    }

    post(url, data) {
        return this.createRequest(url, 'post', data);
    }

    async createRequest(url, method, data = {}) {
        const params = data.params || {};
        const body = method === 'post' ? JSON.stringify(params) : undefined;
        const headers = new Headers(data.headers);
        
        headers.set('Content-Type', data.html ? 'text/html' : 'application/json');

        const req = new Request(url, { method, body, headers });
        const res = await fetch(req);

        return data.html ? await res.text() : await res.json();
    }

    query(keyValue = {}) {
        const query = [];
        
        for (let key in keyValue) {
            query.push(`${key}=${keyValue[key]}`);
        }

        return query.join('&');
    }

    getUrl(uri) {
        return `http://localhost:7777/${uri}`;
    }
 }

export default new Ajax();