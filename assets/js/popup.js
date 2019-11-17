import dom from './dom';

class Popup {
    constructor(dom, data) {
        this.dom = dom;
        if (typeof data === 'object') {
            this.open(data);
        }
    }

    open(data) {
        const popups = document.querySelectorAll('.popup');
        const currentPopup = this.popup || new this.dom(data.tagName || 'div');
        const numberOfInstance = this.popup ? popups.length : popups.length-1;

        currentPopup
            .setAttributes({ class: 'popup', style: `z-index:${numberOfInstance}` })
            .addClass(`instance_${numberOfInstance}`)
            .empty()
            .setContent(data.content)
            .removeClass('close');

        if (typeof data.shouldRenderCloseButton === 'undefined' || data.shouldRenderCloseButton) {
            currentPopup.appendChild(this.createCloseButton());
        }

        document.body.appendChild(currentPopup.el);

        this.popup = currentPopup;
    }

    createCloseButton() {
        const btn = new this.dom('div');
        
        btn.addClass('closeButton').addEventListener('click', () => this.close);

        return btn;
    }

    close() {
        this.popup.addClass('closed');
    }
}

export default Popup.bind(this, dom);