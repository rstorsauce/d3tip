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
var router_1 = require('@angular/router');
var github_1 = require('../../services/github');
var RepoDetail = (function () {
    function RepoDetail(github, router, route) {
        this.github = github;
        this.router = router;
        this.route = route;
        this.repoDetails = {};
    }
    RepoDetail.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.org = _this.router.routerState.parent(_this.route).snapshot.params['org'];
            _this.repo = params['repo'] || '';
            if (_this.repo) {
                _this.github.getRepoForOrg(_this.org, _this.repo)
                    .subscribe(function (repoDetails) {
                    _this.repoDetails = repoDetails;
                });
            }
        });
    };
    RepoDetail = __decorate([
        core_1.Component({
            selector: 'repo-detail',
            pipes: [],
            providers: [],
            directives: [router_1.ROUTER_DIRECTIVES],
            styles: [require('./repo-detail.css')],
            template: require('./repo-detail.html')
        }), 
        __metadata('design:paramtypes', [github_1.Github, router_1.Router, router_1.ActivatedRoute])
    ], RepoDetail);
    return RepoDetail;
}());
exports.RepoDetail = RepoDetail;
//# sourceMappingURL=repo-detail.js.map