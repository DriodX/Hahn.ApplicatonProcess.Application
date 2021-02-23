import { ValidationController } from 'aurelia-validation';
import { Container } from 'aurelia-dependency-injection';
import { ValidationControllerFactory } from 'aurelia-validation';
import {
  ValidationRenderer,
  RenderInstruction,
  ValidateResult
} from 'aurelia-validation';

export class BootstrapFormRenderer {
  render(instruction: RenderInstruction) {

    for (let { result, elements } of instruction.unrender) {
      for (let element of elements) {
        this.remove(element, result);
      }
    }

    for (let { result, elements } of instruction.render) {
      for (let element of elements) {
        this.add(element, result);
      }
    }
  }

  add(element: Element, result: ValidateResult) {
    if (result.valid) {

      // enable submit button
      var btn = (document.getElementById('sendBtn') as HTMLButtonElement);
      if (btn != null || btn != undefined) {
        btn.disabled = false;
      }
      return;
    }

    // add the is-invalid class to the enclosing form-group div
    element.classList.add('is-invalid');

    const formGroup = element.closest('.form-group');
    if (!formGroup) {
      return;
    }

    // add help-block
    const message = document.createElement('div');
    message.className = 'invalid-feedback';
    message.textContent = result.message;
    message.id = `validation-message-${result.id}`;
    formGroup.appendChild(message);

    // disable submit button
    var btn = (document.getElementById('sendBtn') as HTMLButtonElement);
    if (btn != null || btn != undefined) {
      btn.disabled = true;
    }
  }

  remove(element: Element, result: ValidateResult) {
    if (result.valid) {
      // enable submit button
      var btn = (document.getElementById('sendBtn') as HTMLButtonElement);
      if (btn != null || btn != undefined) {
        btn.disabled = false;
      }
      return;
    }

    const formGroup = element.closest('.form-group');
    if (!formGroup) {
      return;
    }

    // remove help-block
    const message = formGroup.querySelector(`#validation-message-${result.id}`);
    if (message) {
      formGroup.removeChild(message);

      // remove the is-invalid class from the enclosing form-group div
      if (formGroup.querySelectorAll('.invalid-feedback').length === 0) {
        element.classList.remove('is-invalid');
      }
    }

    // disable submit button
    var btn = (document.getElementById('sendBtn') as HTMLButtonElement);
    if (btn != null || btn != undefined) {
      btn.disabled = true;
    }
  }
}

export class BootstrapValidationControllerFactory extends ValidationControllerFactory {
  constructor(container: Container) {
    super(container);
  }
  public static get(container: Container) {
    return new BootstrapValidationControllerFactory(container);
  }

  createForCurrentScope(): ValidationController {
    let ctrl = super.createForCurrentScope();
    ctrl.addRenderer(new BootstrapFormRenderer());
    return ctrl;
  }
}

export class BootstrapValidationController extends ValidationController {
  public static get(container: Container) {
    return new BootstrapValidationControllerFactory(container).createForCurrentScope();
  }
}
(BootstrapValidationController as any)['protocol:aurelia:resolver'] = true;