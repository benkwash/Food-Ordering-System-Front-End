import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams} from '@angular/common/http';
import {ServerDomainService} from "../../../services/http/server-domain.service";

@Injectable()
export class CustomerService {
    private serverDomain:string;
    private rawDomain:string;
	constructor(private  http: HttpClient,private httpDomain:ServerDomainService){
        this.rawDomain = this.httpDomain.getDomain();
        this.serverDomain = this.rawDomain+"/customer";

	}

	




	
	//let params = new HttpParams().set("paramName",paramValue).set("paramName2", paramValue2); 

	saveOrderCart(cart){
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};
		return this.http.post(this.serverDomain+'/saveordercart',cart,options);
	}

	getMyOrders(filter){
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		let params = new HttpParams().set("filter",filter)
		const options = {headers:headers,params:params};

		return this.http.get(this.serverDomain+'/getcustomerorders',options);
	}

	getOneOrderDetail(orderID){
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		let params = new HttpParams().set("_id",orderID)
		const options = {headers:headers,params:params};

		return this.http.get(this.serverDomain+'/getoneorderdetail',options);
	}

	//replies to reviews/ratings
	sendReply(doc){
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};
		return this.http.post(this.serverDomain+'/sendreply',doc,options);
	}

	updatecustomerorder(update){
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};
		return this.http.post(this.serverDomain+'/updatecustomerorder',update,options);
	}

}
