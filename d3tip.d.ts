import * as d3 from 'd3';
export declare enum Direction {
    TOP = 0,
    BOTTOM = 1,
    LEFT = 2,
    RIGHT = 3,
}
export interface Options<Datum> {
    formatter?: (d: Datum, i?: number, o?: number) => string;
    direction?: Direction | string;
    classed?: string;
}
export default function d3tip<Datum>(options?: Options<Datum>): (selection: d3.Selection<Datum>, ...args: any[]) => any;
