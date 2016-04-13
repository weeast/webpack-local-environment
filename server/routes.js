'use strict';

const fs = require('fs');

const glob = require('glob');

const Jade = require('koa-jade');
const proxy = require('koa-proxy');

const list = require('../mock/list');
const pkg = require('../package.json');

module.exports = (router, app, staticDir) => {
    const jade = new Jade({
        viewPath: __dirname,
        debug: false,
        pretty: false,
        compileDebug: false,
        app: app
    });
    // mock api
    router.get('/api/list', function*() {
        let query = this.query || {};
        let offset = query.offset || 0;
        let limit = query.limit || 10;
        let diff = limit - list.length;

        if (diff <= 0) {
            this.body = {
                code: 0,
                data: list.slice(0, limit)
            };
        } else {
            let arr = list.slice(0, list.length);
            let i = 0;

            while (diff--) arr.push(arr[i++]);

            this.body = {
                code: 0,
                data: arr
            };
        }
    });

    // proxy api
    router.get('/api/foo/bar', proxy({
        host: 'http://foo.bar.com'
    }));

    /*    render(app, {
            root: __dirname,
            layout: false,
            viewExt: 'html',
            cache: false,
            debug: true
        });*/

    router.get('/', function*() {
        let pages = fs.readdirSync(staticDir);
        let components = [];

        pages = pages.filter((page) => {
            return /\.html$/.test(page);
        });

        if (/src$/.test(staticDir)) {
            let componentsDir = glob.sync(staticDir + '/js/components/**/__test__/index.js');
            componentsDir.forEach((filePath) => {
                let componentName = filePath.substring(filePath.indexOf('\/components\/') + 12, filePath.indexOf('\/__test__\/index.js'));
                components.push(componentName);
            })
        }
        this.render('home', {
            pages: pages || [],
            components: components,
            title: pkg.name || ''
        });
    });
};