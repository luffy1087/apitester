import ajax from './ajax';
import api from './api';
import popup from './popup';
import { $ } from './dom';

class FormControls {
    
    constructor(ajax, api, popup) {
        this.ajax = ajax;
        this.api = api;
        this.popup = new popup();
        $('#add').addEventListener('click', this.addStepOrScenario.bind(this));
        $('#up').addEventListener('click', this.swapSteps.bind(this, -1));
        $('#down').addEventListener('click', this.swapSteps.bind(this, 1));
        $('#remove').addEventListener('click', this.removeStep.bind(this));
        $('#showDetails').addEventListener('click', this.showEnvironmentDetails.bind(this));
        this.fillSelects()
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

    createSelectChild(tagName = 'option', value, text = null) {
        const $el = $(tagName);
        const el = $el.get(0);
        
        if (tagName === 'option') {
            el.value = value;
            el.text = text || value;
        } else {
            el.label = value;
        }

        return $el;
    }
    
    swapSteps(nextPosition) {
        const $steps = $('#steps');
        const steps = $steps.get(0);
        const selectedIndex = steps.selectedIndex;
        const nextIndex = selectedIndex+nextPosition;
        const options = [ ...steps.options ];
        
        steps.focus();
        if (selectedIndex === -1 || typeof options[nextIndex] === 'undefined') { return; }
    
        const currentStep = options[selectedIndex];
        const nextStep = options[nextIndex];

        $steps.empty();
        options[selectedIndex] = nextStep;
        options[nextIndex] = currentStep;
        options.forEach(opt => this.addOption($steps, opt.value, opt.text));
        steps.selectedIndex = nextIndex;
    }

    removeStep() {
        const steps = $('#steps').get(0);
        const selectedIndex = steps.selectedIndex;

        if (steps.selectedIndex === -1) { return; }

        steps.options.remove(selectedIndex);
        steps.selectedIndex  = selectedIndex - 1 > -1 ? selectedIndex - 1 : selectedIndex;
        steps.focus();
    }

    async addStepOrScenario() {
        const stepsOrScenario = await this.api.addStepOrScenario();
        
        if (!stepsOrScenario || !stepsOrScenario.areSteps && !stepsOrScenario.isScenario || stepsOrScenario.paths.length === 0) {
            return;
        }
        
        const $steps = $('#steps');
        if (stepsOrScenario.isScenario) {
            $steps.empty();
        }

        stepsOrScenario.paths.forEach((path) => this.addOption($steps, path.queryFullPath, path.fileName));
    }

    async fillSelects() {
        const envs = await this.api.getEnvironments();
        const steps = await this.api.getSteps();

        this.addOptionGroup($('#environment'), envs);
        steps.forEach((step) => this.addOption($('#steps'), step));
    }

    async showEnvironmentDetails() {
        const environment = $('#environment').get(0).value;
        const htmlResponse = await this.ajax.get('getEnvironmentDetails', { params: { environment }, html: true });

        this.popup.open({ content: htmlResponse, closeButtonCnt: 'X' });
    }
};

export default FormControls.bind(this, ajax, api, popup);