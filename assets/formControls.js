import fs from 'fs';

class FormControls {
    constructor() {
        document.getElementById('up').addEventListener('click', this.swapSteps.bind(this, -1));
        document.getElementById('down').addEventListener('click', this.swapSteps.bind(this, 1));
        document.getElementById('removeStep').addEventListener('click', this.removeStep.bind(this));
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
        options.forEach(opt => { this.addOption('steps', opt.value); });
        steps.selectedIndex = nextIndex;
    }

    removeStep() {
        const steps = document.getElementById('steps');
        const selectedIndex = steps.selectedIndex;

        if (steps.selectedIndex === -1) { return; }

        steps.options.remove(selectedIndex);
    }

    fill(source, id) {
        id = id || source;
        fs.readdirSync(source).forEach(this.tryAddOption.bind(this, id));
    }
};

export default new FormControls();