'use strict';
var d3 = require('d3');
(function (Direction) {
    Direction[Direction["TOP"] = 0] = "TOP";
    Direction[Direction["BOTTOM"] = 1] = "BOTTOM";
    Direction[Direction["LEFT"] = 2] = "LEFT";
    Direction[Direction["RIGHT"] = 3] = "RIGHT";
})(exports.Direction || (exports.Direction = {}));
var Direction = exports.Direction;
function toDirection(value) {
    switch (value) {
        case Direction.TOP:
        case Direction.BOTTOM:
        case Direction.LEFT:
        case Direction.RIGHT:
            return value;
    }
    if (typeof value === 'string') {
        switch (value.toLowerCase()) {
            case 'top':
                return Direction.TOP;
            case 'bottom':
                return Direction.BOTTOM;
            case 'left':
                return Direction.LEFT;
            case 'right':
                return Direction.RIGHT;
        }
    }
    return Direction.TOP;
}
function d3tip(options) {
    if (options === void 0) { options = {}; }
    options.direction = toDirection(options.direction);
    return function (selection) {
        var tip;
        selection
            .on('mouseover', function (d, i, o) {
            var formatter = options.formatter, direction = options.direction, classed = options.classed;
            var element = selection[o][i];
            var elementBound = element.getBoundingClientRect();
            tip = d3
                .select('body')
                .append('div')
                .html(formatter ? formatter(d, i, o) : d.toString())
                .classed('d3tip', true);
            if (classed)
                tip.classed(classed, true);
            var dom = $(document);
            var documentWidth = dom.width();
            var documentHeight = dom.height();
            var box = $(tip.node());
            var w = box.outerWidth();
            var h = box.outerHeight();
            var x;
            var y;
            if (direction === Direction.TOP || direction === Direction.BOTTOM) {
                x = elementBound.right - (elementBound.width / 2) - (w / 2);
                y = (direction === Direction.TOP) ? elementBound.top - h : elementBound.bottom;
                if (y < 0) {
                    direction = Direction.BOTTOM;
                    y = elementBound.bottom;
                }
                else if (y + h > documentHeight) {
                    direction = Direction.TOP;
                    y = elementBound.top - h;
                }
            }
            else {
                x = (direction === Direction.LEFT) ? elementBound.left - w : elementBound.right;
                y = elementBound.bottom - (elementBound.height / 2) - (h / 2);
                if (x < 0) {
                    direction = Direction.RIGHT;
                    x = elementBound.right;
                }
                else if (x + w > documentWidth) {
                    direction = Direction.LEFT;
                    x = elementBound.left - w;
                }
            }
            switch (direction) {
                case Direction.TOP:
                    tip.classed('d3tip-top', true);
                    break;
                case Direction.BOTTOM:
                    tip.classed('d3tip-bottom', true);
                    break;
                case Direction.LEFT:
                    tip.classed('d3tip-left', true);
                    break;
                case Direction.RIGHT:
                    tip.classed('d3tip-right', true);
                    break;
            }
            var bumper = 5;
            if (x < 0) {
                x = bumper;
            }
            else if (x + w > documentWidth) {
                x = documentWidth - w - bumper;
            }
            if (y < 0) {
                y = bumper;
            }
            else if (y + h > documentHeight) {
                y = documentHeight - h - bumper;
            }
            tip
                .style({
                'left': x + "px",
                'top': y + "px"
            });
        })
            .on('mouseout', function (d, i, o) {
            tip.remove();
            tip = null;
        });
    };
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = d3tip;
//# sourceMappingURL=index.js.map