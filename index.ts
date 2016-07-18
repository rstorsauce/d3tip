import {select, Selection} from 'd3-selection';

export type Position = 'top' | 'bottom' | 'left' | 'right' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
export type Target = 'element' | 'pointer';

const DEFAULT_DISTANCE:number = 10;
const DEFAULT_POSITION:Position = 'topRight';

// export interface Angle {
//   x:number;
//   y:number;
//   angle:number;
//   radius:number;
// }
//
// export interface AngleWithPointer {
//   x:number;
//   y:number;
// }

export interface Options {
  html?:string|((d?:any, i?:number, nodes?:Node[]) => string);
  classed?:string[]|((d?:any, i?:number, nodes?:Node[]) => string[]);
  distance?:number;
  target?:Target;
  
  position?:Position|((d?:any, i?:number, nodes?:Node[]) => Position);
  //pointerBasePosition?:string|((d?:Datum, i?:number, o?:number)  => string);
  //angleBasePosition?:(d?:Datum, i?:number, o?:number) => Angle;
  //angleWithPointerBasePosition?:(d?:Datum, i?:number, o?:number) => AngleWithPointer;
}

function option<T>(d:any, i:number, nodes:Node[], option:T|((d?:any, i?:number, nodes?:Node[]) => T), defaultValue:T):T {
  if (!option) return defaultValue;
  if (typeof option === 'function') {
    const fn = option as ((d?:any, i?:number, nodes?:Node[]) => T);
    return fn(d, i, nodes);
  }
  return option;
}

export default function d3tip(options:Options = {}):(selection:Selection, ...args) => any {
  return (selection:Selection, ...args) => {
    let tipController:TipController;
    
    selection
      .on('mouseover', (d:any, i:number, nodes:Node[]) => {
        const html:string = option<string>(d, i, nodes, options.html, '-');
        const classed:string[] = option<string[]>(d, i, nodes, options.classed, []);
        
        const targetElement:Element = nodes[i] as Element;
        const targetBound:ClientRect = targetElement.getBoundingClientRect();
        
        const tip:Selection = select('body')
          .append('div')
          .html(html)
          .style('position', 'absolute')
          .style('pointer-events', 'none')
          .style('opacity', 0);
        
        if (classed && classed.length > 0) {
          classed.forEach(name => tip.classed(name, true));
        } else {
          tip.classed('d3tip', true);
        }
        
        const distance:number = (typeof options.distance === 'number') ? options.distance : DEFAULT_DISTANCE;
        const position:Position = option<Position>(d, i, nodes, options.position, DEFAULT_POSITION);
        
        if (tipController) tipController.destroy();
        
        if (options.target === 'element') {
          tipController = new ElementBaseTipController(tip, targetBound, distance, position);
        } else {
          tipController = new PointerBaseTipController(tip, distance, position);
        }
        //else if (mode === MODE.ANGLE) {}
        //else if (mode === MODE.ANGLE_WITH_POINTER) {}
      })
      .on('mouseout', () => {
        tipController.destroy();
        tipController = null;
      })
  }
}

interface TipController {
  destroy();
}

class ElementBaseTipController implements TipController {
  constructor(private tip:Selection, targetBound:ClientRect, distance:number, position:Position) {
    const documentWidth:number = window.innerWidth;
    const documentHeight:number = window.innerHeight;
    
    const tipElement:HTMLDivElement = tip.node() as HTMLDivElement;
    const tipWidth:number = tipElement.offsetWidth;
    const tipHeight:number = tipElement.offsetHeight;
    
    const bumper:number = 5;
    
    let x:number, y:number, tx:number, ty:number;
    
    if (position === 'left' || position === 'right') {
      y = targetBound.bottom - (targetBound.height / 2) - (tipHeight / 2);
      ty = y;
    } else if (position === 'top' || position === 'topLeft' || position === 'topRight') {
      y = targetBound.top - tipHeight;
      ty = y - distance;
      if (ty < 0) {
        y = targetBound.bottom;
        ty = y + distance;
      }
    } else {
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
    } else if (position === 'right') {
      x = targetBound.right;
      tx = x + distance;
      if (tx + tipWidth > documentWidth) {
        x = targetBound.left - tipWidth;
        tx = x - distance;
      }
    } else if (position === 'topLeft' || position === 'bottomLeft') {
      x = targetBound.right - (targetBound.width / 2) - tipWidth;
      tx = x - distance;
      if (tx < 0) {
        x = targetBound.right - (targetBound.width / 2);
        tx = x + distance;
      }
    } else if (position === 'topRight' || position === 'bottomRight') {
      x = targetBound.right - (targetBound.width / 2);
      tx = x + distance;
      if (tx + tipWidth > documentWidth) {
        x = targetBound.right - (targetBound.width / 2) - tipWidth;
        tx = x - distance;
      }
    } else {
      x = targetBound.right - (targetBound.width / 2) - (tipWidth / 2);
      tx = x;
    }
    
    if (tx < 0) {
      tx = bumper;
      x = tx + distance;
    } else if (tx + tipWidth > documentWidth) {
      tx = documentWidth - tipWidth - bumper;
      x = tx - distance;
    }
    
    if (ty < 0) {
      ty = bumper;
      y = ty + distance;
    } else if (ty + tipHeight > documentHeight) {
      ty = documentHeight - tipHeight - bumper;
      y = ty - distance;
    }
    
    tip
      .style('transition-property', 'transform, opacity')
      .style('left', x + 'px')
      .style('top', y + 'px')
      .style('opacity', 1)
      .style('transform', `translate(${tx - x}px, ${ty - y}px)`)
  }
  
  destroy() {
    this.tip.remove();
  }
}

class PointerBaseTipController implements TipController {
  private x:number;
  private y:number;
  private tx:number;
  private ty:number;
  private w:number;
  private h:number;
  private bumper:number = 5;
  
  constructor(private tip:Selection, distance:number, pos:Position) {
    const tipElement:HTMLDivElement = tip.node() as HTMLDivElement;
    this.w = tipElement.offsetWidth;
    this.h = tipElement.offsetHeight;
    
    if (pos === 'left' || pos === 'right') {
      this.y = this.h / -2;
      this.ty = 0;
    } else if (pos === 'top' || pos === 'topLeft' || pos === 'topRight') {
      this.y = -this.h;
      this.ty = -distance;
    } else {
      this.y = 0;
      this.ty = distance;
    }
    
    if (pos === 'top' || pos === 'bottom') {
      this.x = this.w / -2;
      this.tx = 0;
    } else if (pos === 'left' || pos === 'topLeft' || pos === 'bottomLeft') {
      this.x = -this.w;
      this.tx = (pos === 'left') ? -distance : 0;
    } else {
      this.x = 0;
      this.tx = (pos === 'right') ? distance : 0;
    }
    
    window.addEventListener('mousemove', this.mousemove);
    
    tip
      .style('transition-property', 'transform, opacity')
      .style('opacity', 1)
      .style('transform', `translate(${this.tx}px, ${this.ty}px)`)
  }
  
  private mousemove = (event?:MouseEvent) => {
    const documentWidth:number = window.innerWidth;
    const documentHeight:number = window.innerHeight;
    
    let px:number = event.pageX + this.x;
    let py:number = event.pageY + this.y;
    
    if (px < 0) {
      px = this.bumper;
    } else if (px + this.w > documentWidth) {
      px = documentWidth - this.w - this.bumper;
    }
    
    if (py < 0) {
      py = this.bumper;
    } else if (py + this.h > documentHeight) {
      py = documentHeight - this.h - this.bumper;
    }
    
    this.tip
      .style('left', px + 'px')
      .style('top', py + 'px')
  }
  
  destroy() {
    this.tip.remove();
    window.removeEventListener('mousemove', this.mousemove);
  }
}

