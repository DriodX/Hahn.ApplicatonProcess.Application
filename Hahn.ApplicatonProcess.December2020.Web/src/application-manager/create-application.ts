import { ApplicantCreatedResponse } from './../services/Responses/applicant-response';
import { CreateResponses } from './../services/Responses/create-json-response';
import { Router } from 'aurelia-router';
import { inject, NewInstance } from "aurelia-framework";
import { EventAggregator } from 'aurelia-event-aggregator';
import { DialogService } from 'aurelia-dialog';
import * as toastr from "toastr";
import { ApplicationService } from "../services/application-service";
import { IApplication } from './iapplication';
import { MessageBox } from "../resources/dialogs/message-box";
import { ApplicationViewed, ApplicationUpdated } from "../resources/messages/application-messages";
import { HttpClient, HttpResponseMessage } from 'aurelia-http-client';
import { ValidationController, ValidationControllerFactory, ValidationRules, Validator } from 'aurelia-validation';
import { BootstrapFormRenderer } from '../resources/elements/bootstrap-form-renderer';

@inject(Router, DialogService, ApplicationService, EventAggregator, ValidationControllerFactory)
export class CreateApplication {
    routeConfig;
    controller = null;

    // prop for application
    name: string;
    familyName: string;
    address: string;
    countryOfOrigin: string;
    emailAddress: string;
    age: number;
    hired: boolean;

    constructor(private router: Router,
        private dialogService: DialogService,
        private applicationService: ApplicationService,
        private ea: EventAggregator, controllerFactory) {

        this.controller = controllerFactory.createForCurrentScope();
        this.controller.addRenderer(new BootstrapFormRenderer());
    }

    send() {
        this.controller
            .validate()
            .then(v => {
                // if all fields are active
                if (v.valid) {
                    let application = <IApplication> {
                        name: this.name,
                        familyName: this.familyName,
                        address: this.address,
                        countryOfOrigin: this.countryOfOrigin,
                        emailAddress: this.emailAddress,
                        age: this.age,
                        hired: this.hired
                    };

                    this.applicationService.create(application).then(async response => {
                        let apiResponse = <HttpResponseMessage>response;

                        // if post was successful
                        if (apiResponse.isSuccess) {
                            var responseCreator = new CreateResponses();
                            let applicantResponse = responseCreator
                                .CreateJsonResponse<ApplicantCreatedResponse>(apiResponse);

                            // use the created id to get applicant details
                            this.applicationService.get(applicantResponse.id).then(async appResponse => {
                                var resultApp = <IApplication>appResponse;
                                this.ea.publish(new ApplicationUpdated(resultApp));

                                // navigate to successful page
                                let appCreated = this.router.routes.find(x => x.name === 'applicationcreated');
                                appCreated.applicant = resultApp;
                                this.router.navigateToRoute('applicationcreated');
                            });
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

    get resetEnabled() {
        return !this.name
            && !this.familyName
            && !this.address
            && !this.countryOfOrigin
            && !this.emailAddress
            && this.age == 0
    }

    async reset() {
        let result = await this.dialogService.open(
            {
                viewModel: MessageBox, model: "Are you sure you want to reset data?"
            }).whenClosed(response => {

                if (response.wasCancelled) {
                    return false;
                } else {
                    this.name = '';
                    this.familyName = '';
                    this.countryOfOrigin = '';
                    this.address = '';
                    this.emailAddress = '';
                    this.age = 0;
                    this.hired = false;
                }
                console.log(response.output);
                return true;
            });

        console.log(result);
        return result;
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
                    }
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

    .on(CreateApplication)
