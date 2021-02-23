import { Aurelia, PLATFORM } from "aurelia-framework";
import { Router, RouterConfiguration, NavigationInstruction } from "aurelia-router";
export class Index {
  router: Router;

  configureRouter(config: RouterConfiguration, router: Router) {
    config.options.pushState = true;
    config.options.root = '/';
    config.map([
      {
        route: "",
        moduleId: PLATFORM.moduleName("../application-manager/no-selection"),
        title: "",
        name: "applicationmanager"
      },

      {
        route: "applications/:id",
        moduleId: PLATFORM.moduleName("../application-manager/application-detail"),
        name: "applications"
      },
      {
        route: "createapplication", 
        name: "createapplication",
        moduleId: PLATFORM.moduleName("../application-manager/create-application"),
      }
      ,
      {
        route: "applicationcreated", 
        name: "applicationcreated",
        moduleId: PLATFORM.moduleName("../application-manager/application-created"),
      }
    ]);

    this.router = router;
  }
}
