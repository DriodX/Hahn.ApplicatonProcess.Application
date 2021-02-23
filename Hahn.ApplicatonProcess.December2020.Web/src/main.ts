import { Aurelia } from 'aurelia-framework';
import * as environment from '../config/environment.json';
import { PLATFORM } from 'aurelia-pal';
import 'bootstrap/dist/css/bootstrap.css';
import 'font-awesome/css/font-awesome.css';
import '../styles/bootstrap-flat.css';
import '../styles/bootstrap-flat-extras.css';
import '../styles/awesome-bootstrap-checkbox.css';
import '../styles/styles.css'
import 'nprogress/nprogress.css';
import 'toastr/build/toastr.css'
import "bootstrap";
import { I18N, Backend, TCustomAttribute } from 'aurelia-i18n';
import resBundle from 'i18next-resource-store-loader!./assets/i18n/index.js';

export function configure(aurelia: Aurelia): void {
  aurelia.use
    .standardConfiguration()
    .developmentLogging()
    .plugin(PLATFORM.moduleName('aurelia-dialog'))
    .plugin(PLATFORM.moduleName('aurelia-validation'))
    .feature(PLATFORM.moduleName('resources/index'))
    .plugin(PLATFORM.moduleName('aurelia-i18n'), instance => {
      return instance.setup({
        resources: resBundle, //<-- configure aurelia-i18n to use your bundled translations
        lng: 'en',
        attributes: ['t'],
        fallbackLng: 'de',
        ns: ['universal', 'post-form'],
        defaultNS: 'universal',
        debug: false,
      });
    })




  // .plugin(PLATFORM.moduleName('aurelia-i18n'), instance =>{
  //   let aliases = ['t', 'i18n'];
  //     // add aliases for 't' attribute
  //     TCustomAttribute.configureAliases(aliases);

  //     // register backend plugin
  //     instance.i18next.use(Backend.with(aurelia.loader));

  //     // adapt options to your needs (see http://i18next.com/docs/options/)
  //     // make sure to return the promise of the setup method, in order to guarantee proper loading
  //     return instance.setup({
  //       backend: {                                  // <-- configure backend settings
  //         loadPath: './locales/{{lng}}/{{ns}}.json', // <-- XHR settings for where to get the files from
  //       },
  //       attributes: aliases,
  //       lng : 'de',
  //       fallbackLng : 'en',
  //       ns: ['universal', 'post-form'],
  //       defaultNS: 'universal',
  //       debug : false
  //     });

  //   // instance.i18next.use(Backend.with(aurelia.loader));
  //   // return instance.setup({
  //   //   backend: {
  //   //     loadPath: '.locales/{{lng}}/{{ns}}.json'
  //   //   },
  //   //   lng: 'en',
  //   //   fallbackLng: 'de',
  //   //   ns: ['universal', 'post-form'],
  //   //   debug: false
  //   // });
  // });

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin(PLATFORM.moduleName('aurelia-testing'));
  }

  aurelia.start().then(() => aurelia.setRoot(PLATFORM.moduleName('shell/shell')));
}
