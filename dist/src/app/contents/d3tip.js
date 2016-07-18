"use strict";
var d3_selection_1 = require("d3-selection");
var DEFAULT_DISTANCE = 10;
var DEFAULT_POSITION = "topRight";
function option(d, i, arr, option, defaultValue) {
    if (!option)
        return defaultValue;
    if (typeof option === 'function') {
        var fn = option;
        return fn(d, i, arr);
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
        var tip;
        selection
            .on('mouseover', function (d, i, arr) {
            console.log('d3tip.ts..()', d, i, arr);
            var html = option(d, i, arr, options.html, '-');
            var classed = option(d, i, arr, options.classed, []);
            var mode;
            if (options.target === 'element') {
                mode = "element";
            }
            else {
                mode = "pointer";
            }
            // else if (options.angleBasePosition) {
            //   mode = MODE.ANGLE;
            // } else if (options.angleWithPointerBasePosition) {
            //   mode = MODE.ANGLE_WITH_POINTER;
            // }
            var element = this;
            var elementBound = element.getBoundingClientRect();
            tip = d3_selection_1.select('body')
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
            // let dom:Element = document;
            var documentWidth = window.innerWidth;
            var documentHeight = window.innerHeight;
            var box = tip.node();
            var w = box.offsetWidth;
            var h = box.offsetHeight;
            //----------------------------------------------------------------
            // ELEMENT BOUND BASE POSITION
            //----------------------------------------------------------------
            if (mode === "element") {
                var distance = (typeof options.distance === 'number') ? options.distance : DEFAULT_DISTANCE;
                var pos = option(d, i, arr, options.position, DEFAULT_POSITION);
                var x = void 0;
                var y = void 0;
                var tx = void 0;
                var ty = void 0;
                if (pos === "left" || pos === "right") {
                    y = elementBound.bottom - (elementBound.height / 2) - (h / 2);
                    ty = y;
                }
                else if (pos === "top" || pos === "topLeft" || pos === "topRight") {
                    y = elementBound.top - h;
                    ty = y - distance;
                    if (ty < 0) {
                        y = elementBound.bottom;
                        ty = y + distance;
                    }
                }
                else {
                    y = elementBound.bottom;
                    ty = y + distance;
                    if (ty + h > documentHeight) {
                        y = elementBound.top - h;
                        ty = y - distance;
                    }
                }
                if (pos === "left") {
                    x = elementBound.left - w;
                    tx = x - distance;
                    if (tx < 0) {
                        x = elementBound.right;
                        tx = x + distance;
                    }
                }
                else if (pos === "right") {
                    x = elementBound.right;
                    tx = x + distance;
                    if (tx + w > documentWidth) {
                        x = elementBound.left - w;
                        tx = x - distance;
                    }
                }
                else if (pos === "topLeft" || pos === "bottomLeft") {
                    x = elementBound.right - (elementBound.width / 2) - w;
                    tx = x - distance;
                    if (tx < 0) {
                        x = elementBound.right - (elementBound.width / 2);
                        tx = x + distance;
                    }
                }
                else if (pos === "topRight" || pos === "bottomRight") {
                    x = elementBound.right - (elementBound.width / 2);
                    tx = x + distance;
                    if (tx + w > documentWidth) {
                        x = elementBound.right - (elementBound.width / 2) - w;
                        tx = x - distance;
                    }
                }
                else {
                    x = elementBound.right - (elementBound.width / 2) - (w / 2);
                    tx = x;
                }
                var bumper = 5;
                if (tx < 0) {
                    tx = bumper;
                    x = tx + distance;
                }
                else if (tx + w > documentWidth) {
                    tx = documentWidth - w - bumper;
                    x = tx - distance;
                }
                if (ty < 0) {
                    ty = bumper;
                    y = ty + distance;
                }
                else if (ty + h > documentHeight) {
                    ty = documentHeight - h - bumper;
                    y = ty - distance;
                }
                tip
                    .style('transition-property', 'transform, opacity')
                    .style('left', x)
                    .style('top', y)
                    .style('opacity', 1)
                    .style('transform', "translate(" + (tx - x) + "px, " + (ty - y) + "px)");
            }
            else if (mode === "pointer") {
                var distance = (typeof options.distance === 'number') ? options.distance : DEFAULT_DISTANCE;
                var pos = option(d, i, arr, options.position, DEFAULT_POSITION);
                var x = void 0;
                var y = void 0;
                var tx = void 0;
                var ty = void 0;
                if (pos === "left" || pos === "right") {
                    y = h / -2;
                    ty = 0;
                }
                else if (pos === "top" || pos === "topLeft" || pos === "topRight") {
                    y = -h;
                    ty = -distance;
                }
                else {
                    y = 0;
                    ty = distance;
                }
                if (pos === "top" || pos === "bottom") {
                    x = w / -2;
                    tx = 0;
                }
                else if (pos === 'left' || pos === 'topLeft' || pos === 'bottomLeft') {
                    x = -w;
                    tx = (pos === 'left') ? -distance : 0;
                }
                else {
                    x = 0;
                    tx = (pos === 'right') ? distance : 0;
                }
                var bumper = 5;
                // let mousemove = (event:JQueryEventObject) => {
                //   let px:number = event.pageX + x;
                //   let py:number = event.pageY + y;
                //
                //   if (px < 0) {
                //     px = bumper;
                //   } else if (px + w > documentWidth) {
                //     px = documentWidth - w - bumper;
                //   }
                //
                //   if (py < 0) {
                //     py = bumper;
                //   } else if (py + h > documentHeight) {
                //     py = documentHeight - h - bumper;
                //   }
                //
                //   tip
                //     .style('left', px)
                //     .style('top', py)
                // };
                //
                // let $window = $(window).on('mousemove', mousemove);
                // let $element = $(element).on('mouseout', () => {
                //   $window.off();
                //   $element.off();
                // });
                tip
                    .style('transition-property', 'transform, opacity')
                    .style('opacity', 1)
                    .style('transform', "translate(" + tx + "px, " + ty + "px)");
            }
            //----------------------------------------------------------------
            // ANGLE BASE POSITION
            //----------------------------------------------------------------
            //else if (mode === MODE.ANGLE) {
            //
            //}
            //else if (mode === MODE.ANGLE_WITH_POINTER) {
            //
            //}
        })
            .on('mouseout', function () {
            tip.remove();
            tip = null;
        });
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = d3tip;
//# sourceMappingURL=d3tip.js.map