import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ServerDomainService} from "../../../services/http/server-domain.service";

@Injectable()
export class AccountsOperationsService {
	private serverDomain:string;
	private rawDomain:string;

  constructor(private  http: HttpClient,private httpDomain:ServerDomainService){
        this.rawDomain = this.httpDomain.getDomain();
        this.serverDomain = this.rawDomain+"/manage/accounts";
  }


  public getRestaurantAccounts(){
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    const options = {headers:headers};
    return this.http.get(this.serverDomain+"/getaccountsdetails",options)
  }


  public getNDaysDetails(){
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    const options = {headers:headers};
    return this.http.get(this.serverDomain+"/getndaysdetails",options)
  }


}






