require('LESS/common.less');
require('LESS/a.less');

var components = require('JS/components/head_nav/index');

components.init({
    target: '.container'
}).render()