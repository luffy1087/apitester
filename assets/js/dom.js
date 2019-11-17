class DOM {
    constructor(tagName) {
        if (typeof tagName !== 'string') {
            new Error("tagName must be defined");
        }

        this.el = document.createElement(tagName);

        return this;
    }
    
    setAttributes(attrs = {}) {
        for (let key in attrs) {
            key = key.toLowerCase();
            if (key === 'class') {
                this.addClass(attrs[key]);
            } else if (key === 'style') {
                this.addStyle(attrs[key]);
            } else {
                this.el.setAttribute(key, attrs[key]);
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

            this.el.style[prop] = ruleValue.trim();
        }

        return this;
    }

    addClass(className) {
        this.el.classList.add(className);

        return this;
    }

    removeClass(className) {
        this.el.classList.add(className);

        return this;
    }

    toggleClass(className) {
        this.el.classList.toggle(className);
        
        return this;
    }

    setContent(content) {
        this.el.innerHTML = content;

        return this;
    }

    appendChild(el) {
        el = el instanceof DOM ? el.el : el;
        
        this.el.appendChild(el);

        return this;
    }

    empty() {
        while (this.el.children.length > 0) {
            this.el.children[0].remove();
        }

        return this;
    }

    addEventListener(evtName, callback) {
        this.el.addEventListener(evtName, callback);

        return this;
    }

    get el() {
        return this._el;
    }

    set el(el) {
        this._el = el;
    }

}

export default DOM;