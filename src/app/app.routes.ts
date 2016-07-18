import {provideRouter, RouterConfig} from "@angular/router";
import {BasicSampleComponent} from "./contents/basic-sample.component";

const routes:RouterConfig = [
  {path: '', redirectTo: 'home', terminal: true},
  {path: 'home', component: BasicSampleComponent}
];

export const APP_ROUTER_PROVIDERS = [
  provideRouter(routes)
];
