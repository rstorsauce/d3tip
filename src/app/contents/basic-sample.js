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
var core_1 = require("@angular/core");
var d3_selection_1 = require('d3-selection');
var d3tip_1 = require('d3tip');
require('d3tip/index.css');
var BasicSampleComponent = (function () {
    function BasicSampleComponent() {
    }
    BasicSampleComponent.prototype.ngAfterViewInit = function () {
        var target = this.targetElement.nativeElement;
        d3_selection_1.select(target)
            .call(d3tip_1.default({
            html: 'hello world????'
        }));
    };
    __decorate([
        core_1.ViewChild('target'), 
        __metadata('design:type', core_1.ElementRef)
    ], BasicSampleComponent.prototype, "targetElement", void 0);
    BasicSampleComponent = __decorate([
        core_1.Component({
            selector: 'basic-sample',
            template: "\n    <div #target>Hello World</div>\n  ",
            styles: ["\n    div {\n      width: 200px;\n      height: 200px;\n      background-color: #eeeeee;\n    }\n  "]
        }), 
        __metadata('design:paramtypes', [])
    ], BasicSampleComponent);
    return BasicSampleComponent;
}());
exports.BasicSampleComponent = BasicSampleComponent;
//# sourceMappingURL=basic-sample.js.map