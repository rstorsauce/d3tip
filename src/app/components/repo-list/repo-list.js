"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var github_1 = require('../../services/github');
var router_1 = require('@angular/router');
var RepoList = (function () {
    function RepoList(github, route) {
        this.github = github;
        this.route = route;
    }
    RepoList.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.org = params['org'];
            if (_this.org) {
                _this.repos = _this.github.getReposForOrg(_this.org);
            }
        });
    };
    RepoList = __decorate([
        core_1.Component({
            selector: 'repo-list',
            pipes: [],
            providers: [],
            directives: [router_1.ROUTER_DIRECTIVES],
            styles: [require('./repo-list.css')],
            template: require('./repo-list.html'),
        }), 
        __metadata('design:paramtypes', [github_1.Github, router_1.ActivatedRoute])
    ], RepoList);
    return RepoList;
}());
exports.RepoList = RepoList;
//# sourceMappingURL=repo-list.js.map