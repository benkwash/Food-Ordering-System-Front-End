import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ServerDomainService} from "../../../services/http/server-domain.service";

@Injectable()
export class StaffOperationsService {
	private serverDomain:string;
	private rawDomain:string;

  constructor(private  http: HttpClient,private httpDomain:ServerDomainService){
        this.rawDomain = this.httpDomain.getDomain();
        this.serverDomain = this.rawDomain+"/manage/staff";
  }

	public getBackendAdminServerUrl():string {
		return this.serverDomain;
	}

//   //retrieve basic school information:departments and classes
// 	//retrieve silently or not
// 	public getBasicSchoolClassesInfo(retrieveSilently:boolean = false){
// 		let options = {};
// 		if(retrieveSilently){
// 			options["headers"] = new HttpHeaders({'ignoreLoadingBar':''});
// 		}

// 		return this.http.get(this.serverDomain+"/classes",options);
// 	}
	// //search student or staff information from server
	// //search by name
	// public searchUserInformation(form){
	// 	let headers = new HttpHeaders({'Content-Type':'application/json','ignoreLoadingBar':''});
	// 	const options = {headers:headers};

	// 	return this.http.post(this.serverDomain+"/user_search",form,options);
	// }

	
	//get staff info given staff id
	public getStaffInfo(id){
		let params = new HttpParams().set("staffID",id);
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers,params:params};
		return this.http.get(this.serverDomain+'/getstaffinfo',options)
    }
    
    public getAllStaffInfo(){
		
		let options ={}
        return this.http.get(this.serverDomain+'/getallstaffinfo',options);
	}
	
	public saveStaffInfo(data){

		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};
		
		return this.http.post(this.serverDomain+'/savenewstaff',data,options)
	}
	
	//update a specific staff information
	public updateStaffInfo(data){
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};
		
		return this.http.post(this.serverDomain+'/updatestaffinfo',data,options)
	}

	public deleteStaffInfo(staffID){

		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};
		
		return this.http.post(this.serverDomain+'/deletestaffinfo',{staff:staffID},options)
	}

	public createStaffAccount(account){

		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};
		
		return this.http.post(this.serverDomain+'/createstaffaccount',account,options)
	}

	public disableStaffAccount(account){
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};
		
		return this.http.post(this.serverDomain+'/disablestaffaccount',account,options)
	}

	public enableStaffAccount(account){
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};
		
		return this.http.post(this.serverDomain+'/enablestaffaccount',account,options)
	}

	public resetStaffPassword(account){
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};
		
		return this.http.post(this.serverDomain+'/resetstaffpassword',account,options)
	}

}
