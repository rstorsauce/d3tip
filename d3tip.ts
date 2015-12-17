'use strict'
/// <reference path="./typings/tsd.d.ts"/>
import * as d3 from 'd3';

export enum Direction { TOP, BOTTOM, LEFT, RIGHT }

function toDirection(value:any):Direction {
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

export interface Options<Datum> {
	formatter?:(d:Datum, i?:number, o?:number) => string;
	direction?:Direction|string;
	classed?:string;
}

export default function d3tip<Datum>(options:Options<Datum> = {}):(selection:d3.Selection<Datum>, ...args:any[]) => any {
	options.direction = toDirection(options.direction);

	return (selection:d3.Selection<Datum>) => {
		let tip:d3.Selection<Datum>;

		selection
			.on('mouseover', (d, i, o) => {
				let {formatter, direction, classed} = options;
				let element:Element = selection[o][i] as Element;
				let elementBound:ClientRect = element.getBoundingClientRect();

				tip = d3
					.select('body')
					.append('div')
					.html(formatter ? formatter(d, i, o) : d.toString())
					.classed('d3tip', true)

				if (classed) tip.classed(classed, true);

				let dom = $(document);
				let documentWidth:number = dom.width();
				let documentHeight:number = dom.height();

				let box = $(tip.node());
				let w:number = box.outerWidth();
				let h:number = box.outerHeight();

				let x:number;
				let y:number;

				if (direction === Direction.TOP || direction === Direction.BOTTOM) {
					x = elementBound.right - (elementBound.width / 2) - (w / 2);
					y = (direction === Direction.TOP) ? elementBound.top - h : elementBound.bottom;

					if (y < 0) {
						direction = Direction.BOTTOM;
						y = elementBound.bottom;
					} else if (y + h > documentHeight) {
						direction = Direction.TOP;
						y = elementBound.top - h;
					}
				} else {
					x = (direction === Direction.LEFT) ? elementBound.left - w : elementBound.right;
					y = elementBound.bottom - (elementBound.height / 2) - (h / 2);

					if (x < 0) {
						direction = Direction.RIGHT;
						x = elementBound.right;
					} else if (x + w > documentWidth) {
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

				const bumper:number = 5;

				if (x < 0) {
					x = bumper;
				} else if (x + w > documentWidth) {
					x = documentWidth - w - bumper;
				}

				if (y < 0) {
					y = bumper;
				} else if (y + h > documentHeight) {
					y = documentHeight - h - bumper;
				}

				tip
					.style({
						'left': `${x}px`,
						'top': `${y}px`
					})

			})
			.on('mouseout', (d, i, o) => {
				tip.remove();
				tip = null;
			})
	}
}

