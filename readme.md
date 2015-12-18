# D3 Tooltip 

```
import * as d3 from 'd3';
import d3tip from 'd3tip';
import 'd3tip/dist/d3tip.css!';

d3.select('#button')
  .call(d3tip({
    formatter: (d) => d.toString(),
    direction: 'top'
  }))
```

- `formatter?: (d:Datum, i?:number, o?:number) => string`
- `direction?: string = 'top|bottom|left|right'`
- `classed?: string` ← Add css classname to tooltip div