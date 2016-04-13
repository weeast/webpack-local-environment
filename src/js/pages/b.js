require('LESS/common.less');
require('LESS/b.less');

var components = require('JS/components/playerrank_table/index');

components.init({
    target: '.container'
}).render()