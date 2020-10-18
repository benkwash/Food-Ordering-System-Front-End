import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ServerDomainService} from "../../../services/http/server-domain.service";

@Injectable()
export class StaffOperationsService {
	private serverDomain:string;
	private rawDomain:string;

  constructor(private  http: HttpClient,private httpDomain:ServerDomainService){
	  this.rawDomain = this.httpDomain.getDomain();
    this.serverDomain = this.rawDomain+"/staff";
  }

	public getBackendAdminServerUrl():string {
		return this.serverDomain;
	}


	public getStaffInfo(){
		// let headers= new HttpHeaders({})	
		let options ={}
		return this.http.get(this.serverDomain+'/getstaffinformation',options)
	}
	//update restaurant configuration information 
	public updateRestaurantConfiguration(updates,ifNew){
		let params = new HttpParams()
			.set("ifNew",ifNew);
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers,params:params};
		
		return this.http.post(this.serverDomain+'/configuration',updates,options)
	}

	getRestaurantInfo(){
		
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};
		return this.http.get(this.serverDomain+'/getrestaurantinfo',options)
	}
}
