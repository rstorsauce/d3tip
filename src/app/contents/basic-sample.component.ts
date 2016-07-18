import {Component, ViewChild, ElementRef, AfterViewInit} from "@angular/core";
import {select} from "d3-selection";
import d3tip from "d3tip";

@Component({
  selector: 'basic-sample',
  template: `
    <div #target> </div>
  `,
  styles: [`
    :host {
      position: relative;
    }

    div {
      position: absolute;
      left: 200px;
      top: 150px;
      width: 200px;
      height: 200px;
      background-color: #eeeeee;
    }
  `]
})
export class BasicSampleComponent implements AfterViewInit {
  @ViewChild('target') private targetElement:ElementRef;
  
  ngAfterViewInit() {
    const target:HTMLDivElement = this.targetElement.nativeElement as HTMLDivElement;
    
    select(target)
      .call(d3tip({
        html: 'hello world????',
        target: 'pointer'
      }))
  }
}