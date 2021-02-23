import { I18N } from 'aurelia-i18n';
import { inject, PLATFORM } from "aurelia-framework";
import { Router, RouterConfiguration } from "aurelia-router";

@inject(I18N)
export class Shell {
  router: Router;
  i18n;

  constructor(I18N) {
    this.i18n = I18N;
  }

  configureRouter(config: RouterConfiguration, router: Router) {
    config.title = "Hahn Application Process";
    config.map([
      { route: "", redirect: "applicationmanager" },
      {
        route: "applicationmanager", name: "applicationmanager",
        moduleId: PLATFORM.moduleName("../application-manager/index"),
        nav: true, title: ""
      }
    ]);

    this.router = router;
  }

  setEnglishLocale() {
    this.i18n.setLocale('en');
  }
  
  setGermanLocale() {
    this.i18n.setLocale('ge');
  }
}