'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

{
    var addOptions = function addOptions(id, file) {
        var reg = /\.(json|js)$/;

        if (!reg.test(file)) {
            return;
        }

        var value = file.replace(reg, '');
        var option = document.createElement('option');
        var options = document.getElementById(id).options;
        option.value = value;
        option.text = value;
        options.add(option);
    };

    _fs2.default.readdirSync('env').forEach(addOptions.bind(undefined, 'environment'));
    _fs2.default.readdirSync('steps').forEach(addOptions.bind(undefined, 'steps'));
}