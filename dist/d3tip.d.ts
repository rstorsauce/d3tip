/// <reference path="../src/typings/tsd.d.ts" />
export interface Options<Datum> {
    html?: string | ((d?: Datum, i?: number, o?: number) => string);
    classed?: string[] | ((d?: Datum, i?: number, o?: number) => string[]);
    distance?: number;
    target?: string;
    position?: string | ((d?: Datum, i?: number, o?: number) => string);
}
export default function d3tip<Datum>(options?: Options<Datum>): (selection: d3.Selection<Datum>, ...args: any[]) => any;
