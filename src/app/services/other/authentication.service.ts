import { Injectable } from '@angular/core';
import {Router} from "@angular/router";
import {AppDataService} from '../data/app-data.service';

@Injectable()
export class AuthenticationService {
  authenticated:boolean = false;

  //constructor
  constructor(private appData:AppDataService,private router:Router) {}

  	public signUserIn()
	{
	  	//token should have a value
	  	//moreover,current accountType should match provided accountType
    	let token = this.appData.getUserToken();
		let accountType = this.appData.getAccountType();
		let url = this.appData.getUrl();

		//if no token is provided and remember me isn's set(i.e false)
		//authentication should fail.
		//if not(token available or && is remembered), the retrieve authentication information from storage
    	if (token != ""){
			//set data
			this.setBrowserStorageData(token,accountType,url);
			this.authenticated = true;
    	}
		else {
			this.authenticated = false;
		}
	}//end of method

	  
	//there is a big issue with using local storage
	//https://dev.to/rdegges/please-stop-using-local-storage-1i04:heated topic
	public setBrowserStorageData(token:string,acctType:string,url:string):void{
		// store jwt token & other data in local storage
		// to keep user logged in between page refreshes
		sessionStorage.setItem('aitproject-user-token',token);
		sessionStorage.setItem('aitproject-user-acctType',acctType);
		sessionStorage.setItem('aitproject-user-url',url);
	}

	public setStaffPermissionsStorage(){
		let permissions=this.appData.getStaffPermissions();
		sessionStorage.setItem('aitproject-user-staffPermissions',JSON.stringify(permissions))
	}

	public getStaffPermissionsStorage(){
		return sessionStorage.getItem('aitproject-user-staffPermissions')
	}

	public removeStaffPermissionsStorage():void{
		sessionStorage.removeItem('aitproject-user-staffPermissions')
	}
  	public logout()
  	{
		//reset user information
    	this.appData.setUserToken("");
	  	this.appData.setAccountType("");
	  	this.appData.setUrl("");
	 	this.authenticated = false;

		//remove browser data
		this.removeBrowserStorageData();
  	}




	public removeBrowserStorageData():void{
		sessionStorage.removeItem('aitproject-user-token');
		sessionStorage.removeItem('aitproject-user-acctType');
		sessionStorage.removeItem('aitproject-user-url');
		this.removeStaffPermissionsStorage();
	}

	public getBrowserStorageData(){
		let token = sessionStorage.getItem('aitproject-user-token');
		let acctType = sessionStorage.getItem('aitproject-user-acctType');
		let Url = sessionStorage.getItem('aitproject-user-url');
		return {token:token,accountType:acctType,Url:Url};
	}

	//this method will be called by several route guards
  	public isAuthenticated()
	{
		let data =  this.getBrowserStorageData();
		let token = data.token;
		let acctType = data.accountType;
		let Url = data.Url;

		//send an http request to the server and parse webtoken later
		//the server will return decoded token data + new token
		//and the app data will be reset and token data refreshed too
		if(!this.authenticated && token && acctType && Url) {
			this.appData.setUserToken(token);
			this.appData.setAccountType(acctType);
			this.appData.setUrl(Url);
			this.authenticated = true;
		}
		
		return this.authenticated;
  	}

	public isSameUserType(type:string){
		return (this.appData.getAccountType() == type) ? true:false;
	}

	//check whether user is an admin
	public isAdmin():boolean {
		return this.isSameUserType("admin");
	}

	//check whether user is a staff
	public isStaff():boolean {
		return this.isSameUserType("staff");
	}

	//check whether user is a staff
	public isCustomer():boolean {
		return this.isSameUserType("customer");
	}

	//check whether staff has specific permission
	public hasPermission(perm:string):boolean {
		//and since staff is also provided, it's used as an account type
		// let permissions = {staff:bool,menu:bool etc}\
		
		let permissions=this.getStaffPermissionsStorage();
		permissions=JSON.parse(permissions)
		let hasPermission = false;
		//check if given permission is true
		hasPermission=(permissions[perm])?true:false;
		//return bool
		return hasPermission;
	}

}
