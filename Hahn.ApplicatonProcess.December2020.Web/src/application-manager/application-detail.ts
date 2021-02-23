import { Index } from './index';
import { inject } from "aurelia-framework";
import { areEqual } from "../services/utility";
import * as toastr from "toastr";
import { DialogService } from "aurelia-dialog";
import { MessageBox } from "../resources/dialogs/message-box";
import { IApplication } from "./iapplication";
import { ApplicationViewed, ApplicationUpdated } from "../resources/messages/application-messages";
import { EventAggregator } from "aurelia-event-aggregator";
// import { ApplicationService } from "../services/application-service";
import { ApplicationService } from "../services/application-service";
import { ValidationControllerFactory, ValidationRules } from "aurelia-validation";
import { BootstrapFormRenderer } from "../resources/elements/bootstrap-form-renderer";
import { HttpClient, HttpResponseMessage } from "aurelia-http-client";

@inject(DialogService, ApplicationService, EventAggregator, ValidationControllerFactory)
export class ApplicationDetail {
    routeConfig;
    controller = null;

    application: IApplication;
    originalApplication: IApplication;

    // prop for application
    id: number;
    name: string;
    familyName: string;
    address: string;
    countryOfOrigin: string;
    emailAddress: string;
    age: number;
    hired: boolean;

    constructor(private dialogService: DialogService, private applicationService: ApplicationService,
        private ea: EventAggregator, controllerFactory) {
        this.controller = controllerFactory.createForCurrentScope();
        this.controller.addRenderer(new BootstrapFormRenderer());
    }

    activate(params, routeConfig) {
        this.routeConfig = routeConfig;

        return this.applicationService.get(params.id).then(application => {
            this.application = <IApplication>application;

            // init the values
            this.id = this.application.id;
            this.name = this.application.name;
            this.familyName = this.application.familyName;
            this.address = this.application.address;
            this.countryOfOrigin = this.application.countryOfOrigin;
            this.emailAddress = this.application.emailAddress;
            this.age = this.application.age;
            this.hired = this.application.hired;

            this.routeConfig.navModel.setTitle(this.application.name);
            this.originalApplication = JSON.parse(JSON.stringify(this.application));
            this.ea.publish(new ApplicationViewed(this.application));
        });
    }

    save() {
         // update this.application
         this.thisApplication()

        var saveApp = this.application;

        this.controller
            .validate()
            .then(v => {
                // if all fields are active
                if (v.valid) {
                    this.applicationService.save(saveApp).then(async response => {
                        let apiResponse = <HttpResponseMessage>response;
                        if(apiResponse.isSuccess){
                            this.application = <IApplication>apiResponse.content;
                            this.routeConfig.navModel.setTitle(this.application.name);
                            this.originalApplication = JSON.parse(JSON.stringify(this.application));
                            this.ea.publish(new ApplicationUpdated(this.application));
                            toastr.success(`Application info of ${this.application.name} saved successfully!`);
                        }
                        else {
                            // an error occured during the post
                            // displays the error(s) in an aurelia dialog
                            let errorString = ''
                            let errors = <Array<string>>apiResponse.content;
                            errors.forEach(element => {
                                errorString += element + '\n';
                            });

                            await this.dialogService.open(
                                {
                                    viewModel: MessageBox, model: errorString
                                })
                        }
                    });
                }
                else {
                    toastr.error("Some fields are not valid!");
                }
            });
    }

    // ask if you want to leave without saving changes.
    async canDeactivate() {
        // update this.application
        this.thisApplication()


        if (!areEqual(this.originalApplication, this.application)) {
            let result = await this.dialogService.open(
                { viewModel: MessageBox, model: "You have unsaved changes. Are you sure you wish to leave?" }).whenClosed(response => {

                    if (!response.wasCancelled) {
                        return true;
                    } else {
                        this.ea.publish(new ApplicationViewed(this.application));
                    }
                    console.log(response.output);
                    return false;
                });

            console.log(result);
            return result;
        }
        return true;
    }

    // update this.application
    thisApplication() {
        this.application.name = this.name;
        this.application.familyName = this.familyName;
        this.application.address = this.address;
        this.application.countryOfOrigin = this.countryOfOrigin;
        this.application.emailAddress = this.emailAddress;
        this.application.age = this.age;
        this.application.hired = this.hired;
    }
}

// coutnry of origin rule
ValidationRules.customRule(
    'validCountry',
    async (value, obj) => {
        value = value ? value : '';
        var httpClient = new HttpClient()
            .configure(x => {
                x.withInterceptor({
                    response(message) {
                        return message;
                    },
                });
            });
        var response = await httpClient.get('https://restcountries.eu/rest/v2/name/' + value + '?fullText=true');
        return response.isSuccess;
    },
    "${$displayName} is not a valid country."
);

// age rule
ValidationRules.customRule(
    'ageRange',
    (value, obj, min, max) => {
        var num = Number.parseInt(value);
        return num === null || num === undefined || (Number.isInteger(num) && num >= min && num <= max);
    },
    "${$displayName} must be an integer between ${$config.min} and ${$config.max}.",
    (min, max) => ({ min, max })
);

// validation rules
ValidationRules
    .ensure('name')
    .minLength(5)
    .required()
    .withMessage('Name must be at least 5 characters')

    .ensure('familyName')
    .minLength(5)
    .required()
    .withMessage('Family Name must be at least 5 characters')

    .ensure('address')
    .minLength(10)
    .required()
    .withMessage('Address must be at least 10 characters')

    .ensure('countryOfOrigin')
    .required()
    .satisfiesRule('validCountry')


    .ensure('emailAddress')
    .email()
    .required()
    .withMessage('Email must be a valid email address')

    .ensure('age')
    .required()
    .satisfiesRule('ageRange', 20, 60)

    .on(ApplicationDetail)
