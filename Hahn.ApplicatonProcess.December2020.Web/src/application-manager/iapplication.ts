import { ValidationRules } from "aurelia-validation";

export class IApplication {
    id: number;
    name: string;
    familyName: string;
    address: string;
    countryOfOrigin: string;
    emailAddress: string;
    age: number;
    hired: boolean;
}