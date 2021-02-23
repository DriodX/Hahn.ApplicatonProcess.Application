import { FrameworkConfiguration, PLATFORM } from 'aurelia-framework';

export function configure(config: FrameworkConfiguration): void {
  config.globalResources([
    PLATFORM.moduleName('./elements/loading-indicator'),
    PLATFORM.moduleName('./dialogs/message-box')
  ]);
}
