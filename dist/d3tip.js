if (window && !window.hasOwnProperty('exports'))
    window['exports'] = {};
var POS;
(function (POS) {
    POS[POS["TOP"] = 0] = "TOP";
    POS[POS["BOTTOM"] = 1] = "BOTTOM";
    POS[POS["LEFT"] = 2] = "LEFT";
    POS[POS["RIGHT"] = 3] = "RIGHT";
    POS[POS["TOP_LEFT"] = 4] = "TOP_LEFT";
    POS[POS["TOP_RIGHT"] = 5] = "TOP_RIGHT";
    POS[POS["BOTTOM_LEFT"] = 6] = "BOTTOM_LEFT";
    POS[POS["BOTTOM_RIGHT"] = 7] = "BOTTOM_RIGHT";
})(POS || (POS = {}));
var MODE;
(function (MODE) {
    MODE[MODE["ELEMENT"] = 0] = "ELEMENT";
    MODE[MODE["POINTER"] = 1] = "POINTER";
})(MODE || (MODE = {}));
function toPOS(value) {
    switch (value.toLowerCase()) {
        case 'top':
            return POS.TOP;
        case 'bottom':
            return POS.BOTTOM;
        case 'left':
            return POS.LEFT;
        case 'right':
            return POS.RIGHT;
        case 'topleft':
            return POS.TOP_LEFT;
        case 'topright':
            return POS.TOP_RIGHT;
        case 'bottomleft':
            return POS.BOTTOM_LEFT;
        case 'bottomright':
            return POS.BOTTOM_RIGHT;
    }
    return POS.TOP;
}
var DEFAULT_DISTANCE = 10;
var DEFAULT_POSITION = "topRight";
function option(d, i, o, option, defaultValue) {
    if (!option)
        return defaultValue;
    if (typeof option === 'function')
        return option(d, i, o);
    return option;
}
function d3tip(options) {
    if (options === void 0) { options = {}; }
    return function (selection) {
        var tip;
        selection
            .on('mouseover', function (d, i, o) {
            var html = option(d, i, o, options.html, '-');
            var classed = option(d, i, o, options.classed, []);
            var mode;
            if (options.target && options.target.toLowerCase() === 'element') {
                mode = MODE.ELEMENT;
            }
            else {
                mode = MODE.POINTER;
            }
            var element = selection[o][i];
            var elementBound = element.getBoundingClientRect();
            tip = d3
                .select('body')
                .append('div')
                .html(html)
                .style({
                'position': 'absolute',
                'pointer-events': 'none',
                'opacity': 0
            });
            if (classed.length > 0) {
                var classes = {};
                classed.forEach(function (name) { return classes[name] = true; });
                tip.classed(classes);
            }
            else {
                tip.classed('d3tip', true);
            }
            var dom = $(document);
            var documentWidth = dom.width();
            var documentHeight = dom.height();
            var box = $(tip.node());
            var w = box.outerWidth();
            var h = box.outerHeight();
            if (mode === MODE.ELEMENT) {
                var distance = (typeof options.distance === 'number') ? options.distance : DEFAULT_DISTANCE;
                var pos = toPOS(option(d, i, o, options.position, DEFAULT_POSITION));
                var x;
                var y;
                var tx;
                var ty;
                if (pos === POS.LEFT || pos === POS.RIGHT) {
                    y = elementBound.bottom - (elementBound.height / 2) - (h / 2);
                    ty = y;
                }
                else if (pos === POS.TOP || pos === POS.TOP_LEFT || pos === POS.TOP_RIGHT) {
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
                if (pos === POS.LEFT) {
                    x = elementBound.left - w;
                    tx = x - distance;
                    if (tx < 0) {
                        x = elementBound.right;
                        tx = x + distance;
                    }
                }
                else if (pos === POS.RIGHT) {
                    x = elementBound.right;
                    tx = x + distance;
                    if (tx + w > documentWidth) {
                        x = elementBound.left - w;
                        tx = x - distance;
                    }
                }
                else if (pos === POS.TOP_LEFT || pos === POS.BOTTOM_LEFT) {
                    x = elementBound.right - (elementBound.width / 2) - w;
                    tx = x - distance;
                    if (tx < 0) {
                        x = elementBound.right - (elementBound.width / 2);
                        tx = x + distance;
                    }
                }
                else if (pos === POS.TOP_RIGHT || pos === POS.BOTTOM_RIGHT) {
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
                    .style({
                    'transition-property': 'transform, opacity',
                    'left': x + "px",
                    'top': y + "px",
                    'opacity': 1,
                    'transform': "translate(" + (tx - x) + "px, " + (ty - y) + "px)"
                });
            }
            else if (mode === MODE.POINTER) {
                var distance = (typeof options.distance === 'number') ? options.distance : DEFAULT_DISTANCE;
                var pos = toPOS(option(d, i, o, options.position, DEFAULT_POSITION));
                var x;
                var y;
                var tx;
                var ty;
                if (pos === POS.LEFT || pos === POS.RIGHT) {
                    y = h / -2;
                    ty = 0;
                }
                else if (pos === POS.TOP || pos === POS.TOP_LEFT || pos === POS.TOP_RIGHT) {
                    y = -h;
                    ty = -distance;
                }
                else {
                    y = 0;
                    ty = distance;
                }
                if (pos === POS.TOP || pos === POS.BOTTOM) {
                    x = w / -2;
                    tx = 0;
                }
                else if (pos === POS.LEFT || pos === POS.TOP_LEFT || pos === POS.BOTTOM_LEFT) {
                    x = -w;
                    tx = (pos === POS.LEFT) ? -distance : 0;
                }
                else {
                    x = 0;
                    tx = (pos === POS.RIGHT) ? distance : 0;
                }
                var bumper = 5;
                var mousemove = function (event) {
                    var px = event.pageX + x;
                    var py = event.pageY + y;
                    if (px < 0) {
                        px = bumper;
                    }
                    else if (px + w > documentWidth) {
                        px = documentWidth - w - bumper;
                    }
                    if (py < 0) {
                        py = bumper;
                    }
                    else if (py + h > documentHeight) {
                        py = documentHeight - h - bumper;
                    }
                    tip
                        .style({
                        'left': px + "px",
                        'top': py + "px"
                    });
                };
                var $window = $(window).on('mousemove', mousemove);
                var $element = $(element).on('mouseout', function () {
                    $window.off();
                    $element.off();
                });
                tip
                    .style({
                    'transition-property': 'transform, opacity',
                    'opacity': 1,
                    'transform': "translate(" + tx + "px, " + ty + "px)"
                });
            }
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