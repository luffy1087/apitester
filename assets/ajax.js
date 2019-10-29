class Ajax{
    get(url) {
        return this.createRequest('get', url);
    }

    post(url) {
        return this.createRequest('post', url);
    }

    async createRequest(method, url) {
        const req = new Request(url, { method });
        const res = await fetch(req);
        const json = await res.json();
        
        return json;
    }
 }

export default new Ajax();