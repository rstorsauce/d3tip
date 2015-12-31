/// <reference path="typings/tsd.d.ts"/>

enum POS {TOP, BOTTOM, LEFT, RIGHT, TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT}
enum MODE {ELEMENT, POINTER}
//enum MODE {ELEMENT, POINTER, ANGLE, ANGLE_WITH_POINTER}

function toPOS(value:string):POS {
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

//export interface Angle {
//	x:number;
//	y:number;
//	angle:number;
//	radius:number;
//}
//
//export interface AngleWithPointer {
//	x:number;
//	y:number;
//}

export interface Options<Datum> {
	html?:string|((d?:Datum, i?:number, o?:number) => string);
	classed?:string[]|((d?:Datum, i?:number, o?:number) => string[]);
	distance?:number;
	target?:string;

	position?:string|((d?:Datum, i?:number, o?:number) => string);
	//pointerBasePosition?:string|((d?:Datum, i?:number, o?:number)  => string);
	//angleBasePosition?:(d?:Datum, i?:number, o?:number) => Angle;
	//angleWithPointerBasePosition?:(d?:Datum, i?:number, o?:number) => AngleWithPointer;
}

const DEFAULT_DISTANCE:number = 10;
const DEFAULT_POSITION:string = "topRight";

function option<T>(d, i, o, option:any, defaultValue:T):T {
	if (!option) return defaultValue;
	if (typeof option === 'function') return option(d, i, o);
	return option;
}

export default function d3tip<Datum>(options:Options<Datum> = {}):(selection:d3.Selection<Datum>, ...args:any[]) => any {
	return (selection:d3.Selection<Datum>) => {
		let tip:d3.Selection<Datum>;

		selection
			.on('mouseover', (d, i, o) => {
				let html:string = option<string>(d, i, o, options.html, '-');
				let classed:string[] = option<string[]>(d, i, o, options.classed, []);
				let mode:MODE;

				if (options.target && options.target.toLowerCase() === 'element') {
					mode = MODE.ELEMENT;
				} else {
					mode = MODE.POINTER;
				}
				//else if (options.angleBasePosition) {
				//	mode = MODE.ANGLE;
				//} else if (options.angleWithPointerBasePosition) {
				//	mode = MODE.ANGLE_WITH_POINTER;
				//}

				let element:Element = selection[o][i] as Element;
				let elementBound:ClientRect = element.getBoundingClientRect();

				tip = d3
					.select('body')
					.append('div')
					.html(html)
					.style({
						'position': 'absolute',
						'pointer-events': 'none',
						'opacity': 0
					})

				if (classed.length > 0) {
					let classes:{[name:string]:boolean} = {};
					classed.forEach(name => classes[name] = true);
					tip.classed(classes);
				} else {
					tip.classed('d3tip', true);
				}

				let dom = $(document);
				let documentWidth:number = dom.width();
				let documentHeight:number = dom.height();

				let box = $(tip.node());
				let w:number = box.outerWidth();
				let h:number = box.outerHeight();

				//----------------------------------------------------------------
				// ELEMENT BOUND BASE POSITION
				//----------------------------------------------------------------
				if (mode === MODE.ELEMENT) {
					let distance:number = (typeof options.distance === 'number') ? options.distance : DEFAULT_DISTANCE;
					let pos:POS = toPOS(option<string>(d, i, o, options.position, DEFAULT_POSITION));

					let x:number;
					let y:number;
					let tx:number;
					let ty:number;

					if (pos === POS.LEFT || pos === POS.RIGHT) {
						y = elementBound.bottom - (elementBound.height / 2) - (h / 2);
						ty = y;
					} else if (pos === POS.TOP || pos === POS.TOP_LEFT || pos === POS.TOP_RIGHT) {
						y = elementBound.top - h;
						ty = y - distance;
						if (ty < 0) {
							y = elementBound.bottom;
							ty = y + distance;
						}
					} else {
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
					} else if (pos === POS.RIGHT) {
						x = elementBound.right;
						tx = x + distance;
						if (tx + w > documentWidth) {
							x = elementBound.left - w;
							tx = x - distance;
						}
					} else if (pos === POS.TOP_LEFT || pos === POS.BOTTOM_LEFT) {
						x = elementBound.right - (elementBound.width / 2) - w;
						tx = x - distance;
						if (tx < 0) {
							x = elementBound.right - (elementBound.width / 2);
							tx = x + distance;
						}
					} else if (pos === POS.TOP_RIGHT || pos === POS.BOTTOM_RIGHT) {
						x = elementBound.right - (elementBound.width / 2);
						tx = x + distance;
						if (tx + w > documentWidth) {
							x = elementBound.right - (elementBound.width / 2) - w;
							tx = x - distance;
						}
					} else {
						x = elementBound.right - (elementBound.width / 2) - (w / 2);
						tx = x;
					}

					const bumper:number = 5;

					if (tx < 0) {
						tx = bumper;
						x = tx + distance;
					} else if (tx + w > documentWidth) {
						tx = documentWidth - w - bumper;
						x = tx - distance;
					}

					if (ty < 0) {
						ty = bumper;
						y = ty + distance;
					} else if (ty + h > documentHeight) {
						ty = documentHeight - h - bumper;
						y = ty - distance;
					}

					tip
						.style({
							'transition-property': 'transform, opacity',
							'left': `${x}px`,
							'top': `${y}px`,
							'opacity': 1,
							'transform': `translate(${tx - x}px, ${ty - y}px)`
						})
				}
				//----------------------------------------------------------------
				// POINTER BASE POSITION
				//----------------------------------------------------------------
				else if (mode === MODE.POINTER) {
					let distance:number = (typeof options.distance === 'number') ? options.distance : DEFAULT_DISTANCE;
					let pos:POS = toPOS(option<string>(d, i, o, options.position, DEFAULT_POSITION));

					let x:number;
					let y:number;
					let tx:number;
					let ty:number;

					if (pos === POS.LEFT || pos === POS.RIGHT) {
						y = h / -2;
						ty = 0;
					} else if (pos === POS.TOP || pos === POS.TOP_LEFT || pos === POS.TOP_RIGHT) {
						y = -h;
						ty = -distance;
					} else {
						y = 0;
						ty = distance;
					}

					if (pos === POS.TOP || pos === POS.BOTTOM) {
						x = w / -2;
						tx = 0;
					} else if (pos === POS.LEFT || pos === POS.TOP_LEFT || pos === POS.BOTTOM_LEFT) {
						x = -w;
						tx = (pos === POS.LEFT) ? -distance : 0;
					} else {
						x = 0;
						tx = (pos === POS.RIGHT) ? distance : 0;
					}

					const bumper:number = 5;

					let mousemove = (event:JQueryEventObject) => {
						let px:number = event.pageX + x;
						let py:number = event.pageY + y;

						if (px < 0) {
							px = bumper;
						} else if (px + w > documentWidth) {
							px = documentWidth - w - bumper;
						}

						if (py < 0) {
							py = bumper;
						} else if (py + h > documentHeight) {
							py = documentHeight - h - bumper;
						}

						tip
							.style({
								'left': `${px}px`,
								'top': `${py}px`
							})
					};

					let $window = $(window).on('mousemove', mousemove);
					let $element = $(element).on('mouseout', () => {
						$window.off();
						$element.off();
					});

					tip
						.style({
							'transition-property': 'transform, opacity',
							'opacity': 1,
							'transform': `translate(${tx}px, ${ty}px)`
						})
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
			.on('mouseout', () => {
				tip.remove();
				tip = null;
			})
	}
}

