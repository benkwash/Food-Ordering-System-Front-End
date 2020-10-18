import { Component, OnInit,ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";

import {CustomValidatorsService} from "../../services/other/custom-validators.service";
import {AppBackendOperationsService} from "../../services/http/app-backend-operations.service";
import {PushNotificationService} from "../../services/other/push-notifications.service";
import {AccountRecoverProcessService} from "../../services/data/account-recover-process.service";


@Component({
	selector: 'app-password-update',
	templateUrl: './password-update.component.html',
	styleUrls: [
		'./password-update.component.css',
		'../../sign-up/sign-up.component.css'
	]
})
export class PasswordUpdateComponent implements OnInit {
	//password change form
	@ViewChild('passwordForm') passwordForm:NgForm;

	//recovery options
	public username:string = "";
	public oldPassword:string = "";
	public emailRecoveryCode:string = "";
	public updatedPassword:boolean = false;

	public formState= {
		newPassword:{value:"",valid:true,error:""},
		newPasswordConfirm:{value:"",valid:true,error:""}
	};
	public isServerCheckingNewPass:boolean = false;
	public checkedServerNewPass:boolean = false;
	public isNewPassStrongEnough:boolean = true;

	//password toggles
	public newPasswordView:boolean = false;
	public confirmPasswordView:boolean = false;

	//regular expressions and corresponding messages
	public regex = {password:""};
	public errors = {password:""};

	constructor(private router:Router, private http:AppBackendOperationsService,
					private validator:CustomValidatorsService,
					private notification:PushNotificationService,
					private acctRecover:AccountRecoverProcessService)
	{
		this.regex.password = this.validator.passwordRegex();

		this.errors.password = this.validator.getValidationMsg("password");

		this.formState.newPassword.error =  this.errors.password;
		this.formState.newPasswordConfirm.error =  this.errors.password;
	}

	ngOnInit()
	{
		//check if the first phase was completed
		if(this.acctRecover.isPhaseCompleted("forgetPassword") && (
			this.acctRecover.isPhaseCompleted("oldPassword") ||
			this.acctRecover.isPhaseCompleted("emailRecoveryCode") ||
			this.acctRecover.isPhaseCompleted("recoveryNumber"))) {

			//retrieve the recovery info saved
			this.username = this.acctRecover.getUserInformation("username");
			this.oldPassword = this.acctRecover.getUserInformation("oldPassword");
			this.emailRecoveryCode = this.acctRecover.getUserInformation("emailRecoveryCode");
		}
		else {
			//redirect to phase 1 (forget-password phase) if not completed
			this.router.navigate(['account']);
		}
	}

	//check whether new password is valid not the username and is
	// strong enough to be used and check existence on server
	public validateNewPassword():void
	{
		//password must be valid first
		//noinspection TypeScriptUnresolvedVariable
		if(this.passwordForm.controls.newPassword.valid)
		{
			//check if new password is strong enough
			if(!this.validator.passwordStrongEnough(this.formState.newPassword.value)){
				//check whether new password is strong enough
				this.isNewPassStrongEnough = false;
				this.formState.newPassword.error = this.validator.getValidationMsg("strong_password");
				this.passwordForm.controls['newPassword'].setErrors({'incorrect':true})

			}
			else{
				this.isNewPassStrongEnough = true;
				//reset password error to normal password validation
				this.formState.newPassword.error = this.validator.getValidationMsg("password");

				//check new password usage on server(usage by user)
				this.checkNewPassword();
			}
		}
		else {
			//set password error to normal password validation
			this.formState.newPassword.error = this.validator.getValidationMsg("password");
		}
	}

	//compare password with retyped one
	public onPasswordConfirm():void
	{
		//only check password comparison if valid
		//noinspection TypeScriptUnresolvedVariable
		if(this.passwordForm.controls.newPasswordConfirm.valid)
		{
			if(this.formState.newPassword.value !== this.formState.newPasswordConfirm.value){
				//set form validity and error message
				this.formState.newPasswordConfirm.error = this.validator.getValidationMsg("passwordMismatch");
				this.formState.newPasswordConfirm.valid = false;
				this.passwordForm.controls['newPasswordConfirm'].setErrors({'incorrect':true})

			}else {
				this.formState.newPasswordConfirm.valid = true;
			}
		}//end of valid
	}//end of method

	//check if new password exits(or has been already used) on the server
	public checkNewPassword()
	{
		//check if new password exits(or has been already used)
		//noinspection TypeScriptUnresolvedVariable
		if(this.passwordForm.controls.newPassword.valid)
		{
			let form = {
				username:this.username,
				newPassword: this.formState.newPassword.value
			};

			//checking server password
			this.isServerCheckingNewPass = true;

			//server request
			this.http.checkNewPasswordExistRecovery(form)
				.subscribe((response:any)=>
				{
					this.isServerCheckingNewPass = false;
					this.checkedServerNewPass = true; //has checked new password

					if(response.response == "okay")
					{
						//do nothing if new password does not exist(hasn't been used)
						if(!response.data.fetched.exists) {
							this.formState.newPassword.valid = true;
						}
						else if(response.data.fetched.exists) {
							this.formState.newPassword.valid = false;
							this.formState.newPassword.error = this.validator.getValidationMsg("passwordExists");
							this.passwordForm.controls['newPassword'].setErrors({'incorrect':true})
						}
					}
					else if(response.response == "form"){
						this.formState.newPassword.valid = false;
						this.formState.newPassword.error = response.msg;
						this.passwordForm.controls['newPassword'].setErrors({'incorrect':true})
					}
				});//end of subscribe
		}//end of valid new password
	}

	public submitNewPassword()
	{
		//basic password validation is handled by angular, the extra measures
		//passwords(old and new) must be checked by server, and new password must be strong and match confirm
		if(this.passwordForm.valid && !this.isServerCheckingNewPass && this.checkedServerNewPass &&
			this.isNewPassStrongEnough && this.formState.newPassword.valid &&
			this.formState.newPasswordConfirm.valid)
		{
			let form = {
				newPassword: this.formState.newPassword.value,
				confirmNewPassword: this.formState.newPasswordConfirm.value,
				recovery:{
					username:this.username,
					emailRecoveryCode:this.emailRecoveryCode,
					oldPassword:this.oldPassword
				}
			};

			//submit change password.
			this.http.submitNewPassword(form)
				.subscribe((response: any) => {
					if (response.response == "okay" && response.data.fetched.isSaved) {
						this.notification.setSuccessNotification("Password successfully changed");

						//reset some key variables needed
						//this will make the user re-check the old and new password if changing again.
						this.checkedServerNewPass = false;
						this.updatedPassword = true;
					}
					else if (response.response == "form") {
						this.notification.notifyError(response.msg);
					}
				});//end of subscribe
		}//end of validation passed
	}

	public navigateToLogin(){
		//reset account information
		this.acctRecover.resetEntireRecoverAccountProcess();

		this.router.navigate(["/signIn"]);
	}
}
