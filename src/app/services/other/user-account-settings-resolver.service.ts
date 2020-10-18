import { Injectable } from'@angular/core';
import {Resolve,RouterStateSnapshot,ActivatedRouteSnapshot} from "@angular/router";
import {Observable} from "rxjs";

import {AppBackendOperationsService} from "../http/app-backend-operations.service";

@Injectable()
export class UserAccountSettingsResolverService implements Resolve<any> {
  constructor(private userAccountSettings:AppBackendOperationsService) { }

  resolve(route:ActivatedRouteSnapshot,state:RouterStateSnapshot): Observable<any> {
    return this.userAccountSettings.retrieveRecoveryOptions();
  }
}

