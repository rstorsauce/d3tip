import { Selection } from 'd3-selection';
export declare type Position = 'top' | 'bottom' | 'left' | 'right' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
export declare type Target = 'element' | 'pointer';
export interface Options {
    html?: string | ((d?: any, i?: number, nodes?: Node[]) => string);
    classed?: string[] | ((d?: any, i?: number, nodes?: Node[]) => string[]);
    distance?: number;
    target?: Target;
    position?: Position | ((d?: any, i?: number, nodes?: Node[]) => Position);
}
export default function d3tip(options?: Options): (selection: Selection, ...args) => any;
