import { Injectable } from '@angular/core';
import {FunctionsService} from "../other/functions.service";

@Injectable()

export class AppDataService {
	
	//everything defaults to false;
	private userInfo = {
		token: "",
		accountType: "", //admin/customer/staff,etc
		url:"" //to be used in the address bar
	};

	private staffPermissions={
		menu:false,
		staff:false,
		order:false,
		delivery:false
	};


	// //user credentials for chat session
	// private userCredentials = {
	// 	userID:null,
	// 	schoolID:null
	// };



	//constructor
	constructor(private fn:FunctionsService) {}

	// //set user credentials for chat session
	// public setUserCredentials(credentials) {
	// 	this.userCredentials.userID = credentials.userID;
	// 	this.userCredentials.schoolID = credentials.schoolID;
	// }

	// //get user credentials
	// public getUserCredentials() {
	// 	return this.userCredentials;
	// }

	// //check if user credentials are avaiable
	// public isUserCredentialsAvailable() {
	// 	return !!(this.userCredentials.userID && this.userCredentials.schoolID);
	// }
	
	//set user token (generated from the backend)
	public setUserToken(token:string) {
	 	this.userInfo.token = token;
	}

	//get user stored token
	public getUserToken() {
	 	return this.userInfo.token;
	}

	//set user accountType (generated from the backend)
	public setAccountType(type:string) {
		this.userInfo.accountType = type;
	}

	//get user accountType
	public getAccountType() {
		return this.userInfo.accountType ;
	}

	public setStaffPermissions(permissions){
		//{staff:bool,menu:bool ...etc}
		this.staffPermissions=permissions;
	}

	public getStaffPermissions(){
		return this.staffPermissions;
	}

	//set url(to be used in address bar)
	public setUrl(val:string) {
		this.userInfo.url = val;
	}

	//get url(to be used in address bar)
	public getUrl() {
		return this.userInfo.url ;
	}

}
