import { inject } from "aurelia-framework";
import { HttpClient } from "aurelia-http-client";
import { IApplication } from "../application-manager/iapplication";
import { Config } from "./config";
import { IApplicationService } from "./iapplication-service";

@inject(HttpClient)
export class ApplicationService implements IApplicationService {
  private applications: IApplication[];
  isRequesting = false;

  constructor(private httpClient: HttpClient) {
    this.init();
  }
  async init() {
    this.httpClient = new HttpClient()
      .configure(x => {
        x.withBaseUrl(Config.baseApiUrl);
        x.withHeader('Accept', 'application/json');
        x.withHeader('Content-Type', 'application/json');
        x.withInterceptor({
          request(message) {
            return message;
          },

          requestError(error) {
            throw error;
          },

          response(message) {
            return message;
          },

          responseError(error) {
            return error;
          }
        });
      });
  }

  getAll() {
    this.isRequesting = true;
    return new Promise(async (resolve: any) => {
      const http = this.httpClient;
      const response = await http.get("application");
      this.applications = await response.content;
      let results = this.applications;
      resolve(results);
      this.isRequesting = false;
    });
  }

  search(keyword: string) {
    this.isRequesting = true;
    return new Promise(async (resolve: any) => {
      const http = this.httpClient;
      const response = await http.post("application/search", keyword);
      this.applications = await response.content;
      let results = this.applications;
      resolve(results);
      this.isRequesting = false;
    });
  }

  get(id: number) {
    this.isRequesting = true;
    return new Promise(async (resolve: any) => {
      const http = this.httpClient;
      const response = await http.get(`application/${id}`);
      let foundApplication = await response.content;
      let result = foundApplication;
      resolve(result);
      console.log(result);
      this.isRequesting = false;
    });
  }

  save(application) {
    this.isRequesting = true;
    return new Promise(async (resolve: any) => {
      const http = this.httpClient;
      const response = await http.put("application", application);
      resolve(response);
      console.log(response);
      this.isRequesting = false;
    });
  }

  create(newApplication) {
    this.isRequesting = true;
    return new Promise(async (resolve: any) => {
      const http = this.httpClient;
      const response = await http.post("application", newApplication);
      resolve(response);
      console.log(response);
      this.isRequesting = false;
    });
  }

  delete(id: number) {
    this.isRequesting = true;
    return new Promise(async (resolve: any) => {
      const http = this.httpClient;
      const response = await http.delete(`application/${id}`);
      resolve(response);
      console.log(response);
      this.isRequesting = false;
    });
  }
}