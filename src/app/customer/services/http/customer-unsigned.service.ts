import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams} from '@angular/common/http';
import {ServerDomainService} from "../../../services/http/server-domain.service";

@Injectable()
export class CustomerUnsignedService {
    private serverDomain:string;
    private rawDomain:string;
	constructor(private  http: HttpClient,private httpDomain:ServerDomainService){
        this.rawDomain = this.httpDomain.getDomain();
        this.serverDomain = this.rawDomain+"/unauthenticatedcustomer";

	}

	


	
	// //check whether email exists(or being used by another user)
	// public checkEmailExistence(email) {
	// 	let params = new HttpParams().set('email',email);
	// 	let headers = new HttpHeaders({ignoreLoadingBar:''});
	// 	let options = {params:params,headers:headers};

	// 	//ignore loading bar
	// 	return this.http.get(this.serverDomain + '/signup/email',options);
	// }


	// //submit sign up form
	// submitSignUp(form){
	// 	let headers = new HttpHeaders({'Content-Type':'application/json'});
	// 	return this.http.post(this.serverDomain+'/vendor/signUp',form,{headers:headers})
	// }

	// //resend admin account verification mail
	// public resendAdminAcctVerification(id){
	// 	let params = new HttpParams().set("id",id);

	// 	return this.http.get(this.serverDomain+"/resendverificationcode",{params:params});
    // }

	//let params = new HttpParams().set("paramName",paramValue).set("paramName2", paramValue2); 

	getCustomerName(){
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};
		return this.http.get(this.rawDomain+'/account/getcustomername',options);
	}
	
    //get all restaurants from search given a specific region and city
    public getRestaurants(form){
        let headers = new HttpHeaders({'Content-Type':'application/json'});
        return this.http.post(this.serverDomain+'/getrestaurants',form,{headers:headers})
    }

	//get selected restaurant's  menu
    public geAlltRestaurantMenu(form){
        let headers = new HttpHeaders({'Content-Type':'application/json'});
        return this.http.post(this.serverDomain+'/getrestaurantmenu',form,{headers:headers})
    }
}
