import { inject } from "aurelia-framework";
import { Router } from "aurelia-router";
import { ApplicationViewed, ApplicationUpdated } from "../resources/messages/application-messages";
import { EventAggregator } from "aurelia-event-aggregator";
import { ApplicationService } from "../services/application-service";
import { IApplication } from "./iapplication";
import * as toastr from "toastr";
import { HttpRequestMessage, HttpResponseMessage } from "aurelia-http-client";

@inject(Router, ApplicationService, EventAggregator)
export class ApplicationList {
    applications;
    selectedId = 0;
    keyword: string;

    constructor(private router: Router,
        private applicationService: ApplicationService,
        ea: EventAggregator) {
        ea.subscribe(ApplicationViewed, msg => this.select(msg.application));
        ea.subscribe(ApplicationUpdated, msg => {
            let id = msg.application.id;
            let found = this.applications.find(x => x.id === id);

            // refresh apllication list
            this.applicationService.getAll().then(applications => this.applications = applications);

            Object.assign(found, msg.application);
        });
    }

    created() {
        this.applicationService.getAll().then(applications => this.applications = applications);
        toastr.success("Applications loaded!");
    }

    select(application: IApplication) {
        this.selectedId = application.id;
        return true;
    }

    create() {
        this.selectedId = null;
        this.router.navigate('createapplication');
    }

    async delete(id: number) {
        await this.applicationService.delete(id).then(
            response => {
                console.log(response);

                var apiResponse = <HttpResponseMessage>response;
                if(apiResponse.isSuccess){
                    this.selectedId = 0;
                    this.applicationService.getAll().then(applications => this.applications = applications);

                    toastr.success(apiResponse.content);
                    
                    this.router.navigate("");
                }else{
                    toastr.error('Unable to delete applicaiton at the moment, please try again later.');
                }
            }
        );
        return true;
    }
}