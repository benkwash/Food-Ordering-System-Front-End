import { Injectable } from '@angular/core';
import {Resolve} from "@angular/router";
import {Observable, of} from "rxjs";


import {AdminOperationsService} from "../http/admin-operations.service";

@Injectable()
export class ConfigurationResolverService implements Resolve<any>{


    constructor(private adminOp:AdminOperationsService){

    }

    resolve(): Observable<any>{

        return this.adminOp.getRestaurantConfiguration();
    }

}