import fs from 'fs';

class FormControls {
    constructor() {
        this.environments = document.getElementById('environments');
        this.steps = document.getElementById('steps');
        this.buttonUp = document.getElementById('up');
        this.buttonDown = document.getElementById('down');
        this.buttonRemove = document.getElementById('removeStep');
        this.buttonUp.addEventListener('click', this.swapSteps.bind(this, -1));
        this.buttonDown.addEventListener('click', this.swapSteps.bind(this, 1));
        this.buttonRemove.addEventListener('click', this.removeStep.bind(this));
        this.fill('env', 'environment');
        this.fill('steps');
    }

    tryAddOption(id, file) {
        const reg = /\.(json|js)$/;
    
        if (!reg.test(file)) { return; }
    
        const value = file.replace(reg, '');
    
        this.addOption(id, value);
    }
    
    addOption(id, value) {
        document
            .getElementById(id)
            .options
            .add(this.createOption(value));
    }

    createOption(value) {
        const option = document.createElement('option');
        option.value = value;
        option.text = value;

        return option;
    }
    
    swapSteps(nextPosition) {
        const selectedIndex = this.steps.selectedIndex;
        const nextIndex = selectedIndex+nextPosition;
        const options = [...this.steps.options];
        
        if (selectedIndex === -1 || typeof options[nextIndex] === 'undefined') { return; }
    
        const currentStep = options[selectedIndex];
        const nextStep = options[nextIndex];
    
        while (this.steps.options.length > 0) { this.steps.options.remove(0); }
    
        options[selectedIndex] = nextStep;
        options[nextIndex] = currentStep;
        options.forEach(opt => { this.addOption('steps', opt.value); });
        this.steps.selectedIndex = nextIndex;
    }

    removeStep() {
        const selectedIndex = this.steps.selectedIndex;

        if (this.steps.selectedIndex === -1) { return; }

        this.steps.options.remove(selectedIndex);
    }

    fill(source, id) {
        id = id || source;
        fs.readdirSync(source).forEach(this.tryAddOption.bind(this, id));
    }
};

export default new FormControls();