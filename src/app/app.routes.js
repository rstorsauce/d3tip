"use strict";
var router_1 = require("@angular/router");
var basic_sample_component_1 = require("./contents/basic-sample.component");
var routes = [
    { path: '', redirectTo: 'home', terminal: true },
    { path: 'home', component: basic_sample_component_1.BasicSampleComponent }
];
exports.APP_ROUTER_PROVIDERS = [
    router_1.provideRouter(routes)
];
//# sourceMappingURL=app.routes.js.map