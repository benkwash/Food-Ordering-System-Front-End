import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpParams} from '@angular/common/http';
import {ServerDomainService} from "./server-domain.service";

@Injectable()
export class AppBackendOperationsService {
	serverDomain:string;
	constructor(private  http: HttpClient,private httpDomain:ServerDomainService){
		this.serverDomain = this.httpDomain.getDomain();
	}

	//check whether user has access
	//only used when user isn't authenticated and a check has to be made to the server
	//carrying the cookie if possible
	public checkUserAccess() {
		// let headers = new HttpHeaders({ignoreLoadingBar:''});
		// let options = {headers:headers};
		return this.http.get(this.serverDomain + '/access_check');
	}

	//logout a user completely
	//from server too
	public logOutUser() {
		return this.http.get(this.serverDomain + '/logout');
	}

	
	//check whether email exists(or being used by another user)
	public checkEmailExistence(email) {
		let params = new HttpParams().set('email',email);
		let headers = new HttpHeaders({ignoreLoadingBar:''});
		let options = {params:params,headers:headers};

		//ignore loading bar
		return this.http.get(this.serverDomain + '/signup/email',options);
	}

	//submit sign up form
	submitSignUp(form){
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		return this.http.post(this.serverDomain+'/vendor/signUp',form,{headers:headers})
	}

	//submit sign up form
	submitCustomerSignUp(form){
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		return this.http.post(this.serverDomain+'/signUp',form,{headers:headers})
	}

	//resend admin account verification mail
	public resendAdminAcctVerification(id){
		let params = new HttpParams().set("id",id);

		return this.http.get(this.serverDomain+"/resendverificationcode",{params:params});
	}

	//resend customer account verification mail
	public resendCustomerAcctVerification(id){
		let params = new HttpParams().set("id",id);

		return this.http.get(this.serverDomain+"/resendverificationcode",{params:params});
	}


	//submit admin account verification code
	public submitAcctVerification(id,code){
		let params = new HttpParams().set('id',id).set("code",code);

		return this.http.get(this.serverDomain+"/vendor/verify",{params:params});
	}

	//submit admin account verification code
	public submitCustomerAcctVerification(id,code){
		let params = new HttpParams().set('id',id).set("code",code);

		return this.http.get(this.serverDomain+"/customer/verify",{params:params});
	}

	//submit sign up form
	public submitSignIn(form){
		let headers = new HttpHeaders({'Content-Type':'application/json'});

		//accept and send cookies with 'withCredentials:true'
		return this.http.post(this.serverDomain+'/signIn',form,{headers:headers});
	}

	//submit account recovery options
	public submitRecoveryOptions(form){
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};

		return this.http.post(this.serverDomain+'/account/recovery_options',form,options);
	}

	//retrieve account recovery options
	public retrieveRecoveryOptions(){
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};

		return this.http.get(this.serverDomain+'/account/recovery_options',options);
	}

	//submit change password form
	public submitChangePassword(form){
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};

		return this.http.post(this.serverDomain+'/account/change_password',form,options)
	}

	//check old password if correct
	public checkOldCurrentPassword(form){
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};

		return this.http.post(this.serverDomain+'/account/check_password',form,options);
	}

	//check if new password has exists(or has been used) or not
	public checkNewPasswordExist(form) {
		let headers = new HttpHeaders({"Content-Type":'application/json'});

		return this.http.post(this.serverDomain+"/account/check_newpassword",form,{headers:headers});
	}

	//check if new password has exists(or has been used) or not in recovery mode
	public checkNewPasswordExistRecovery(form) {
		let headers = new HttpHeaders({"Content-Type":'application/json'});

		return this.http.post(this.serverDomain+"/account/recover/check_newpassword",form,{headers:headers});
	}

	//get/confirm username
	public confirmUsername(username){
		let params = new HttpParams()
			.set("username",username+"");

		return this.http.get(this.serverDomain+'/account/recover/confirm_username',{params:params});
	}

	//send account recovery code via email
	public sendRecoveryCodeToEmail(form){
		let headers = new HttpHeaders({"Content-Type":"application/json"});

		return this.http.post(this.serverDomain+'/account/recover/send_email_recoverycode',form,{headers:headers});
	}

	//send account recovery code via number
	public sendRecoveryCodeToNumber(form){
		let headers = new HttpHeaders({"Content-Type":"application/json"});

		return this.http.post(this.serverDomain+'/account/recover/send_number_recoverycode',form,{headers:headers});
	}

	//submit recovery code(email or number)
	public submitRecoveryCode(form){
		return this.http.post(this.serverDomain+'/account/recover/submit_recoverycode',form);
	}

	//submit new password
	public submitNewPassword(form){
		return this.http.post(this.serverDomain+'/account/recover/new_password',form);
	}

	public checkOldPassword(form){
		return this.http.post(this.serverDomain+'/account/recover/check_old_password',form);
	}

	//retrieve user credentials (userID and schoolID)
	public getUserCredentials(){
		return this.http.get(this.serverDomain+"/user_credentials");
	}
}
