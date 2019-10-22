'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FormControls = function () {
    function FormControls() {
        _classCallCheck(this, FormControls);

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

    _createClass(FormControls, [{
        key: 'tryAddOption',
        value: function tryAddOption(id, file) {
            var reg = /\.(json|js)$/;

            if (!reg.test(file)) {
                return;
            }

            var value = file.replace(reg, '');

            this.addOption(id, value);
        }
    }, {
        key: 'addOption',
        value: function addOption(id, value) {
            document.getElementById(id).options.add(this.createOption(value));
        }
    }, {
        key: 'createOption',
        value: function createOption(value) {
            var option = document.createElement('option');
            option.value = value;
            option.text = value;

            return option;
        }
    }, {
        key: 'swapSteps',
        value: function swapSteps(nextPosition) {
            var _this = this;

            var selectedIndex = this.steps.selectedIndex;
            var nextIndex = selectedIndex + nextPosition;
            var options = [].concat(_toConsumableArray(this.steps.options));

            if (selectedIndex === -1 || typeof options[nextIndex] === 'undefined') {
                return;
            }

            var currentStep = options[selectedIndex];
            var nextStep = options[nextIndex];

            while (this.steps.options.length > 0) {
                this.steps.options.remove(0);
            }

            options[selectedIndex] = nextStep;
            options[nextIndex] = currentStep;
            options.forEach(function (opt) {
                _this.addOption('steps', opt.value);
            });
            this.steps.selectedIndex = nextIndex;
        }
    }, {
        key: 'removeStep',
        value: function removeStep() {
            var selectedIndex = this.steps.selectedIndex;

            if (this.steps.selectedIndex === -1) {
                return;
            }

            this.steps.options.remove(selectedIndex);
        }
    }, {
        key: 'fill',
        value: function fill(source, id) {
            id = id || source;
            _fs2.default.readdirSync(source).forEach(this.tryAddOption.bind(this, id));
        }
    }]);

    return FormControls;
}();

;

exports.default = new FormControls();