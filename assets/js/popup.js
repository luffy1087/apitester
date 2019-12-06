import { $ } from './dom';

class Popup {
    constructor(data) {
        if (typeof data === 'object') {
            this.open(data);
        }
    }

    open(data) {
        const body = $(document.body);
        const currentPopup = this.createPopUp(data);
        
        this.tryCreateLayer(body);
        body.appendChild(currentPopup);
        this.tryAddCloseButtonEvent(currentPopup);

        currentPopup.addClass('open').removeClass('closed');
    }

    createPopUp(data) {
        const currentPopup = this.popup = this.popup || $(data.tagName || 'div');
        const numberOfInstance = this.popup ? this.popup.getAttribute('data-instance') : document.querySelectorAll('.popup').length+1;
        const popupContent = $('div');
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
            return void $(domLayer).addClass('open').removeClass('closed');
        }
        
        const layer = this.layer = $('div').addClass('popup-layer').addClass('open');
        
        body.appendChild(layer);
    }

    createCloseButton(data) {
        const btn = $('div');
        
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

export default Popup;