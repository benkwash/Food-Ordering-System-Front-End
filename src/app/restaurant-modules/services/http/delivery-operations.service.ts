import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ServerDomainService} from "../../../services/http/server-domain.service";

@Injectable()
export class DeliveryOperationsService {
	private serverDomain:string;
	private rawDomain:string;

  constructor(private  http: HttpClient,private httpDomain:ServerDomainService){
        this.rawDomain = this.httpDomain.getDomain();
        this.serverDomain = this.rawDomain+"/manage/delivery";
  }

  
	public getAllDeliveryInfo(filter){
		let options = {};
		let params = new HttpParams().set("deliveryFilter",filter);

		options["headers"] = new HttpHeaders();
		options['params'] = params;
		return this.http.get(this.serverDomain+"/getdeliveryinformation",options);
	}


	public updateDelivery(form){
		let headers = new HttpHeaders({'Content-Type':'application/json','ignoreLoadingBar':''});
		const options = {headers:headers};

		return this.http.post(this.serverDomain+"/updatedeliverstatus",form,options);
	}


	// //update restaurant configuration information 
	// public updateRestaurantConfiguration(updates,ifNew){
	// 	let params = new HttpParams()
	// 		.set("ifNew",ifNew);
	// 	let headers = new HttpHeaders({'Content-Type':'application/json'});
	// 	const options = {headers:headers,params:params};
		
	// 	return this.http.post(this.serverDomain+'/configuration',updates,options)
	// }
}
