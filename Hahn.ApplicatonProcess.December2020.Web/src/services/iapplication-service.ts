import {IApplication} from "../application-manager/iapplication";

export interface IApplicationService {
    getAll();
    get(id: number);
    search(keyword: string);
    save(application: IApplication);
    create(application: IApplication);
    delete(id: number);
}