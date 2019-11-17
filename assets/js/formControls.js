import ajax from './ajax';
import api from './api';
import popup from './popup';

class FormControls {
    constructor(ajax, api, popup) {
        this.ajax = ajax;
        this.api = api;
        this.popup = new popup();
        this.attachEvent('up', 'click', this.swapSteps.bind(this, -1));
        this.attachEvent('down', 'click', this.swapSteps.bind(this, 1));
        this.attachEvent('removeStep', 'click', this.removeStep.bind(this));
        this.attachEvent('showDetails', 'click', this.showEnvironmentDetails.bind(this));
        this.fillSelects()
    }

    attachEvent(id, evtName, handler) {
        document.getElementById(id).addEventListener(evtName, handler);
    }
    
    addOption(el, value, text) {
        el.appendChild(this.createSelectChild('option', value, text));
    }

    addOptionGroup(el, tree) {
        if (typeof tree.files !== 'undefined') {
            tree.files.forEach((file) => this.addOption(el, file.queryPath, file.name));
        }

        if (typeof tree.dirs !== 'undefined') {
            for (let dir of tree.dirs) {
                let optGroup = this.createSelectChild('optgroup', dir.dirName);
                el.appendChild(optGroup);
                this.addOptionGroup(optGroup, dir);
            }
        }
    }

    createSelectChild(tag = 'option', value, text = null) {
        const el = document.createElement(tag);
        
        if (tag === 'option') {
            el.value = value;
            el.text = text || value;
        } else {
            el.label = value;
        }

        return el;
    }
    
    swapSteps(nextPosition) {
        const steps = document.getElementById('steps')
        const selectedIndex = steps.selectedIndex;
        const nextIndex = selectedIndex+nextPosition;
        const options = [...steps.options];
        
        if (selectedIndex === -1 || typeof options[nextIndex] === 'undefined') { return; }
    
        const currentStep = options[selectedIndex];
        const nextStep = options[nextIndex];
    
        while (steps.options.length > 0) { steps.options.remove(0); }
    
        options[selectedIndex] = nextStep;
        options[nextIndex] = currentStep;
        options.forEach(opt => this.addOption(steps, opt.value, opt.text));
        steps.selectedIndex = nextIndex;
    }

    removeStep() {
        const steps = document.getElementById('steps');
        const selectedIndex = steps.selectedIndex;

        if (steps.selectedIndex === -1) { return; }

        steps.options.remove(selectedIndex);
        steps.selectedIndex  = selectedIndex - 1 > -1 ? selectedIndex - 1 : selectedIndex;
    }

    async fillSelects() {
        const envs = await this.api.getEnvironments();
        const steps = await this.api.getSteps();

        this.addOptionGroup(document.getElementById('environment'), envs);
        steps.forEach((step) => this.addOption(document.getElementById('steps'), step));
    }

    async showEnvironmentDetails() {
        debugger;
        const environment = document.getElementById('environment').value;
        const htmlResponse = await this.ajax.get('getEnvironmentDetails', { params: { environment }, html: true });

        this.popup.open({ content: htmlResponse });
    }
};

export default FormControls.bind(this, ajax, api, popup);