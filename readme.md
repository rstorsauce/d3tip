# D3 Tooltip

## Sample
[Web Site](http://iamssen.github.io/d3tip/) ← [Source Code](https://github.com/iamssen/d3tip/tree/gh-pages)

## Install
```sh
npm install d3tip --save
npm install d3-selection --save
npm install types.d3 --save # d3 4.x typings
```

```typescript
import {select} from 'd3-selection';
import d3tip from 'd3tip';
import 'd3tip/index.css'; // Default tooltip style. If you don't need default style. you have not to import this.

d3.select('#button')
  .datum('HELLO WORLD')
  .call(d3tip({
    html: d => d.toString()
  }))
```

## Options
- `html: string|(d?:any, i?:number, nodes?:Node[]) => string`
- `classed?: string[]|(d?:any, i?:number, nodes?:Node[]) => string[]`
- `distance?: number`
- `target?: string = 'pointer' | 'element'`
- `position?: string|(d?:any, i?:number, nodes?:Node[]) => string = 'left' | 'right' | 'top' | 'bottom' | 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'`