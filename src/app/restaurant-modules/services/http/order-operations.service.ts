import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ServerDomainService} from "../../../services/http/server-domain.service";

@Injectable()
export class OrderOperationsService {
	private serverDomain:string;
	private rawDomain:string;

  constructor(private  http: HttpClient,private httpDomain:ServerDomainService){
        this.rawDomain = this.httpDomain.getDomain();
        this.serverDomain = this.rawDomain+"/manage/order";
  }


  
	public getRestaurantOrders(){
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};

		return this.http.get(this.serverDomain+"/restaurantorders",options);
	}

	public filterRestaurantOrders(filter){
		let params = new HttpParams()
			.set("orderOption",filter);
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers,params:params};
		
		return this.http.get(this.serverDomain+"/restaurantordersfilter",options);
	}

	public getOneOrderDetail(id){
		let params = new HttpParams()
			.set("orderID",id);
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers,params:params};
		
		return this.http.get(this.serverDomain+"/getorderdetails",options);
	}

	public processOrder(orderID){
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};

		return this.http.post(this.serverDomain+'/processorder',{orderID:orderID},options);
	}

	public getDeliveryStaff(){
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};

		return this.http.get(this.serverDomain+"/getdeliverystaff",options);
	}

	public assignDeliveryStaff(form){
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};

		return this.http.post(this.serverDomain+'/assigndeliverystaff',form,options)
	}

	public cancelOrder(form){
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};

		return this.http.post(this.serverDomain+'/cancelorder',form,options)
	}

	public updateOrderStatus(form){
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};

		return this.http.post(this.serverDomain+'/updateorderstatus',form,options)
	}
}
