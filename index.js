"use strict";
var d3_selection_1 = require('d3-selection');
var DEFAULT_DISTANCE = 10;
var DEFAULT_POSITION = 'topRight';
function option(d, i, nodes, option, defaultValue) {
    if (!option)
        return defaultValue;
    if (typeof option === 'function') {
        var fn = option;
        return fn(d, i, nodes);
    }
    return option;
}
function d3tip(options) {
    if (options === void 0) { options = {}; }
    return function (selection) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var tipController;
        selection
            .on('mouseover', function (d, i, nodes) {
            var html = option(d, i, nodes, options.html, '-');
            var classed = option(d, i, nodes, options.classed, []);
            var targetElement = nodes[i];
            var targetBound = targetElement.getBoundingClientRect();
            var tip = d3_selection_1.select('body')
                .append('div')
                .html(html)
                .style('position', 'absolute')
                .style('pointer-events', 'none')
                .style('opacity', 0);
            if (classed && classed.length > 0) {
                classed.forEach(function (name) { return tip.classed(name, true); });
            }
            else {
                tip.classed('d3tip', true);
            }
            var distance = (typeof options.distance === 'number') ? options.distance : DEFAULT_DISTANCE;
            var position = option(d, i, nodes, options.position, DEFAULT_POSITION);
            if (tipController)
                tipController.destroy();
            if (options.target === 'element') {
                tipController = new ElementBaseTipController(tip, targetBound, distance, position);
            }
            else {
                tipController = new PointerBaseTipController(tip, distance, position);
            }
            //else if (mode === MODE.ANGLE) {}
            //else if (mode === MODE.ANGLE_WITH_POINTER) {}
        })
            .on('mouseout', function () {
            tipController.destroy();
            tipController = null;
        });
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = d3tip;
var ElementBaseTipController = (function () {
    function ElementBaseTipController(tip, targetBound, distance, position) {
        this.tip = tip;
        var documentWidth = window.innerWidth;
        var documentHeight = window.innerHeight;
        var tipElement = tip.node();
        var tipWidth = tipElement.offsetWidth;
        var tipHeight = tipElement.offsetHeight;
        var bumper = 5;
        var x, y, tx, ty;
        if (position === 'left' || position === 'right') {
            y = targetBound.bottom - (targetBound.height / 2) - (tipHeight / 2);
            ty = y;
        }
        else if (position === 'top' || position === 'topLeft' || position === 'topRight') {
            y = targetBound.top - tipHeight;
            ty = y - distance;
            if (ty < 0) {
                y = targetBound.bottom;
                ty = y + distance;
            }
        }
        else {
            y = targetBound.bottom;
            ty = y + distance;
            if (ty + tipHeight > documentHeight) {
                y = targetBound.top - tipHeight;
                ty = y - distance;
            }
        }
        if (position === 'left') {
            x = targetBound.left - tipWidth;
            tx = x - distance;
            if (tx < 0) {
                x = targetBound.right;
                tx = x + distance;
            }
        }
        else if (position === 'right') {
            x = targetBound.right;
            tx = x + distance;
            if (tx + tipWidth > documentWidth) {
                x = targetBound.left - tipWidth;
                tx = x - distance;
            }
        }
        else if (position === 'topLeft' || position === 'bottomLeft') {
            x = targetBound.right - (targetBound.width / 2) - tipWidth;
            tx = x - distance;
            if (tx < 0) {
                x = targetBound.right - (targetBound.width / 2);
                tx = x + distance;
            }
        }
        else if (position === 'topRight' || position === 'bottomRight') {
            x = targetBound.right - (targetBound.width / 2);
            tx = x + distance;
            if (tx + tipWidth > documentWidth) {
                x = targetBound.right - (targetBound.width / 2) - tipWidth;
                tx = x - distance;
            }
        }
        else {
            x = targetBound.right - (targetBound.width / 2) - (tipWidth / 2);
            tx = x;
        }
        if (tx < 0) {
            tx = bumper;
            x = tx + distance;
        }
        else if (tx + tipWidth > documentWidth) {
            tx = documentWidth - tipWidth - bumper;
            x = tx - distance;
        }
        if (ty < 0) {
            ty = bumper;
            y = ty + distance;
        }
        else if (ty + tipHeight > documentHeight) {
            ty = documentHeight - tipHeight - bumper;
            y = ty - distance;
        }
        tip
            .style('transition-property', 'transform, opacity')
            .style('left', x + 'px')
            .style('top', y + 'px')
            .style('opacity', 1)
            .style('transform', "translate(" + (tx - x) + "px, " + (ty - y) + "px)");
    }
    ElementBaseTipController.prototype.destroy = function () {
        this.tip.remove();
    };
    return ElementBaseTipController;
}());
var PointerBaseTipController = (function () {
    function PointerBaseTipController(tip, distance, pos) {
        var _this = this;
        this.tip = tip;
        this.bumper = 5;
        this.mousemove = function (event) {
            var documentWidth = window.innerWidth;
            var documentHeight = window.innerHeight;
            var px = event.pageX + _this.x;
            var py = event.pageY + _this.y;
            if (px < 0) {
                px = _this.bumper;
            }
            else if (px + _this.w > documentWidth) {
                px = documentWidth - _this.w - _this.bumper;
            }
            if (py < 0) {
                py = _this.bumper;
            }
            else if (py + _this.h > documentHeight) {
                py = documentHeight - _this.h - _this.bumper;
            }
            _this.tip
                .style('left', px + 'px')
                .style('top', py + 'px');
        };
        var tipElement = tip.node();
        this.w = tipElement.offsetWidth;
        this.h = tipElement.offsetHeight;
        if (pos === 'left' || pos === 'right') {
            this.y = this.h / -2;
            this.ty = 0;
        }
        else if (pos === 'top' || pos === 'topLeft' || pos === 'topRight') {
            this.y = -this.h;
            this.ty = -distance;
        }
        else {
            this.y = 0;
            this.ty = distance;
        }
        if (pos === 'top' || pos === 'bottom') {
            this.x = this.w / -2;
            this.tx = 0;
        }
        else if (pos === 'left' || pos === 'topLeft' || pos === 'bottomLeft') {
            this.x = -this.w;
            this.tx = (pos === 'left') ? -distance : 0;
        }
        else {
            this.x = 0;
            this.tx = (pos === 'right') ? distance : 0;
        }
        window.addEventListener('mousemove', this.mousemove);
        tip
            .style('transition-property', 'transform, opacity')
            .style('opacity', 1)
            .style('transform', "translate(" + this.tx + "px, " + this.ty + "px)");
    }
    PointerBaseTipController.prototype.destroy = function () {
        this.tip.remove();
        window.removeEventListener('mousemove', this.mousemove);
    };
    return PointerBaseTipController;
}());
//# sourceMappingURL=index.js.map