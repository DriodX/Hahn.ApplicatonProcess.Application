import { HttpResponseMessage } from 'aurelia-http-client';
export class CreateResponses {
    CreateJsonResponse<T>(response: HttpResponseMessage) {
        let jsonResponse = <T>response.content;
        return jsonResponse;
    }
}