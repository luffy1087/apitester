import dom from './dom';

class Popup {
    constructor(dom, data) {
        this.dom = dom;
        if (typeof data === 'object') {
            this.open(data);
        }
    }

    open(data) {
        const body = new this.dom(document.body);
        const currentPopup = this.createPopUp(data);
        
        this.tryCreateLayer(body);
        body.appendChild(currentPopup);
        this.tryAddCloseButtonEvent(currentPopup);

        currentPopup.addClass('open').removeClass('closed');
    }

    createPopUp(data) {
        const currentPopup = this.popup = this.popup || new this.dom(data.tagName || 'div');
        const numberOfInstance = this.popup ? this.popup.getAttribute('data-instance') : document.querySelectorAll('.popup').length+1;
        const popupContent = new this.dom('div');
        const shouldRenderCloseButton = typeof data.shouldRenderCloseButton === 'undefined' || data.shouldRenderCloseButton;

        if (shouldRenderCloseButton) {
            popupContent.appendChild(this.createCloseButton(data));
        }

        popupContent
            .addClass('popup-content')
            .setContent(data.content, true);

        currentPopup
            .setAttributes({ class: 'popup', style: `z-index:${numberOfInstance}`, 'data-instance': numberOfInstance })
            .addClass(`instance_${numberOfInstance}`)
            .empty()
            .appendChild(popupContent);

        return currentPopup;
    }

    tryCreateLayer(body) {
        let domLayer = document.querySelector('.popup-layer');
        
        if (domLayer) {
            return void new this.dom(domLayer).addClass('open').removeClass('closed');
        }
        
        const layer = this.layer = new this.dom('div').addClass('popup-layer').addClass('open');
        
        body.appendChild(layer);
    }

    createCloseButton(data) {
        const btn = new this.dom('div');
        
        btn.addClass('closeButton');

        if (typeof data.closeButtonCnt === 'string') {
            btn.setContent(data.closeButtonCnt);
        }

        return btn;
    }

    tryAddCloseButtonEvent(popup) {
        const domCloseButton = popup.querySelector('.closeButton');

        if (!domCloseButton.hasValue) { return; }

        domCloseButton.addEventListener('click', this.close.bind(this));
    }

    close() {
       this.layer
            .removeClass('open')
            .addClass('closed');
        this.popup
            .removeClass('open')
            .addClass('closed');
    }
}

export default Popup.bind(this, dom);