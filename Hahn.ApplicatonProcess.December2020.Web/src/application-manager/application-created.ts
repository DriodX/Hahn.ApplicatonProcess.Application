import { inject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { IApplication } from './iapplication';
import * as toastr from "toastr";

@inject(Router)
export class ApplicationCreated {
    applicant: IApplication

    constructor(private router: Router) { }

    activate(params, routeData) {
        this.applicant = <IApplication>routeData.applicant;
        toastr.success(`Application info of ${this.applicant.name} ${this.applicant.familyName} saved successfully!`);
    }

    // navigate to view details
    viewDetails() {
        this.router.navigate(`applications/${this.applicant.id}`);
    }
}