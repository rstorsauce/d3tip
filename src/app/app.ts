import {Component, ViewEncapsulation} from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

@Component({
  selector: 'app',
  pipes: [],
  providers: [],
  directives: [ ROUTER_DIRECTIVES ],
  template: require('./app.html'),
  styles: [require('d3tip/index.css')],
  encapsulation: ViewEncapsulation.None
})
export class App {
  constructor() {}

}
