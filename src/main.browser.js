"use strict";
var common_1 = require('@angular/common');
var platform_browser_dynamic_1 = require('@angular/platform-browser-dynamic');
var http_1 = require('@angular/http');
// import {enableProdMode} from '@angular/core';
var app_routes_1 = require('./app/app.routes');
var app_1 = require('./app/app');
// enableProdMode()
platform_browser_dynamic_1.bootstrap(app_1.App, [
    http_1.HTTP_PROVIDERS,
    app_routes_1.APP_ROUTER_PROVIDERS,
    { provide: common_1.LocationStrategy, useClass: common_1.HashLocationStrategy }
])
    .catch(function (err) { return console.error(err); });
//# sourceMappingURL=main.browser.js.map