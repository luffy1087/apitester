import ajax from './ajax';
import api from './api';
import popup from './popup';
import { $ } from './dom';

class FormControls {
    
    constructor(ajax, api, popup) {
        this.ajax = ajax;
        this.api = api;
        this.popup = new popup();
        $('#save').addEventListener('click', this.savePipeline.bind(this));
        $('#add').addEventListener('click', this.addStepOrScenario.bind(this));
        $('#up').addEventListener('click', this.swapSteps.bind(this, -1));
        $('#down').addEventListener('click', this.swapSteps.bind(this, 1));
        $('#remove').addEventListener('click', this.removeStep.bind(this));
        $('#showDetails').addEventListener('click', this.showEnvironmentDetails.bind(this));
        $('#environment').addEventListener('change', this.fillSteps.bind(this));
        this.fillSelects();
    }
    
    addOptions(el, value, text) {
        el.appendChild(this.createSelectChild('option', value, text));
    }

    addOptionGroup(el, tree) {
        if (typeof tree.files !== 'undefined') {
            tree.files.forEach((file) => {
                this.addOptions(el, { dirName: tree.dirName, queryPath: file.queryPath }, file.name);
            });
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
        value = typeof value === 'object' ? JSON.stringify(value) : value;
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
        options.forEach(opt => this.addOptions($steps, opt.value, opt.text));
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

        stepsOrScenario.paths.forEach((path) => this.addOptions($steps, path.queryPath, path.fileName));
    }

    async savePipeline() {
        const steps = $('#steps').get(0);
        if (steps.options.length === 0) {
            alert('Pipeline is empty');
        }

        const fileName = await prompt({ title:"Type the file name" });
        if (!fileName) {
            return;
        }

        const stepsObj = Array.prototype.slice.call(steps.options).reduce((prev, cur) => {
            prev.steps.push(cur.value);

            return prev;
        }, { steps: [], fileName });


        const data = await this.api.savePipeline(stepsObj);

        if (data.response !== 'ok') {
            alert(data.response);
        }
    }

    async fillSelects() {
       await this.fillEnvs();
       await this.fillSteps();
    }

    async fillEnvs() {
        const envs = await this.api.getEnvironments();
        const $env = $('#environment');

        this.addOptionGroup($env, envs);
    }

    async fillSteps() {
        const $env = $('#environment');
        if (!$env.hasJsonValue) {
            return void alert('Cannot retrieve value for environment');
        }

        const env = $env.get(0);
        const selectedOption = env.selectedOptions[0];
        if (selectedOption.parentNode.tagName === 'OPTGROUP' && selectedOption.parentNode.label === env.dataset.value) {
            return;
        }

        env.dataset.value = selectedOption.parentNode.label;
        const $steps = $('#steps').empty();
        const steps = await this.api.getSteps($env.jsonValue.dirName);

        steps.forEach((step) => this.addOptions($steps, step.queryPath, step.fileName));
    }

    async showEnvironmentDetails() {
        const environment = $('#environment').jsonValue.queryPath;
        const htmlResponse = await this.ajax.get('getEnvironmentDetails', { query: { environment }, html: true });

        this.popup.open({ content: htmlResponse, closeButtonCnt: 'X' });
    }
};

export default FormControls.bind(this, ajax, api, popup);