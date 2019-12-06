class DOM {
    constructor(data) {
        let els;
        if (DOM.isTagName(data)) {
            els = [ document.createElement(data) ];
        } else if (DOM.isHTML(data)) {
            els = new DOM('div').setContent(data).getChildren();
        } else if (DOM.isFromDOM(data)) {
            els = data.els;
        } else if (data.constructor === Array) {
            els = data;
        } else if (data instanceof HTMLElement) {
            els = [ data ];
        } else {
            els = [ ...document.querySelectorAll(data) ];
        }

        this.els = els;

        return this;
    }

    static $(data) {
        return new DOM(data);
    }

    static isHTML(data) {
        return typeof data === 'string' && /<[^>]+>/i.test(data);
    }

    static isTagName(data) {
        return typeof data && /^[a-z]+$/.test(data);
    }

    static isFromDOM(data) {
        return  data instanceof Object &&
                typeof data.els !== 'undefined' &&
                data.els.constructor === Array &&
                data.els.every(el => el instanceof HTMLElement);
    }
    
    setAttributes(attrs = {}) {
        for (let key in attrs) {
            key = key.toLowerCase();
            if (key === 'class') {
                this.addClass(attrs[key]);
            } else if (key === 'style') {
                this.addStyle(attrs[key]);
            } else {
                this.setAttribute(key, attrs[key]);
            }
        }

        return this;
    }

    addStyle(styles) {
        const rules = styles.split(';').map((style => style.trim()));
        for (let rule of rules) {
            let [ ruleKey, ruleValue ] = rule.split(':');
            let pieces = ruleKey.trim().split('-');
            let prop = pieces.slice(1).reduce((value, currentValue) => {
                return `${value}${currentValue.substring(0,1).toUpperCase()}${currentValue.substring(1)}`;
            }, pieces[0].toLowerCase());

            this.els.forEach(el => { el.style[prop] = ruleValue.trim(); });
        }

        return this;
    }

    getAttribute(attrName) {
        return this.els[0].getAttribute(attrName);
    }

    setAttribute(attrName, attrValue) {
        this.els.forEach(el => el.setAttribute(attrName, attrValue));

        return this;
    }

    addClass(className) {
        this.els.forEach(el => el.classList.add(className));

        return this;
    }

    removeClass(className) {
        this.els.forEach(el => el.classList.remove(className));

        return this;
    }

    toggleClass(className) {
        this.els.forEach(el => el.classList.toggle(className));
        
        return this;
    }

    setContent(content, shouldAppend = false) {
        this.els.forEach(el => el.innerHTML = shouldAppend ? el.innerHTML.concat(content) : content);

        return this;
    }

    appendChild(elToAppend) {
        const elsToAppend = [ ...DOM.isFromDOM(elToAppend) ? elToAppend.els : elToAppend ];
        this.els.forEach(el => elsToAppend.forEach(eta => el.appendChild(eta)));

        return this;
    }

    empty() {
        this.els.forEach(el => {
            while (el.children.length > 0) {
               el.firstChild.remove();
            }
        });

        return this;
    }

    addEventListener(evtName, callback) {
        this.els.forEach(el => el.addEventListener(evtName, callback));

        return this;
    }

    querySelector(selector) {
        const context = this.els[0] || document;
        
        return $(context.querySelector(selector));
    }

    getChildren() {
        return [ ...this.el.children ];
    }

    get(index) {
        return this.els[index];
    }

    get hasValue() {
        return !!this._els;
    }

    get els() {
        return this._els;
    }

    set els(els) {
        this._els = els;
    }

}

const $ = DOM.$;

export { DOM, $ };