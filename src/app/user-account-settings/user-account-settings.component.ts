import { Component, OnInit,ViewChild} from '@angular/core';
import {ActivatedRoute,Data} from "@angular/router";
import {NgForm} from "@angular/forms";

//components
import {CustomValidatorsService} from "../services/other/custom-validators.service";
import {AppBackendOperationsService} from "../services/http/app-backend-operations.service";
import {PushNotificationService} from "../services/other/push-notifications.service";

@Component({
	selector: 'app-user-account-settings',
	templateUrl: './user-account-settings.component.html',
	styleUrls: [
		'./user-account-settings.component.css',
		'../sign-up/sign-up.component.css'
	]
})
export class UserAccountSettingsComponent implements OnInit {
	//recovery form
	@ViewChild('form') form:NgForm;

	//password change form
	@ViewChild('passwordForm') passwordForm:NgForm;

	public formState = {
		telephone:"", email:""
	};
	public passwordFormState= {
		oldPassword:{value:"",valid:true,error:""},
		newPassword:{value:"",valid:true,error:""},
		newPasswordConfirm:{value:"",valid:true,error:""}
	};
	public isServerCheckingOldPass:boolean = false;
	public isServerCheckingNewPass:boolean = false;
	public checkedServerOldPass:boolean = false;
	public checkedServerNewPass:boolean = false;
	public isNewPassStrongEnough:boolean = true;

	//password toggles
	public newPasswordView:boolean = false;
	public confirmPasswordView:boolean = false;


	//regular expressions and corresponding messages
	public regex = {number:"",password:"",email:""};
	public errors = {number:"",email:"",password:""};
	
	public hideRecovery=true;
	public hideChangePassword=true;

	constructor(private validator:CustomValidatorsService, private http:AppBackendOperationsService,
					private route:ActivatedRoute,private notification:PushNotificationService) 
	{
		this.regex.email = this.validator.emailRegex();
		this.regex.number = this.validator.numberRegex();
		this.regex.password = this.validator.passwordRegex();
		
		this.errors.number = this.validator.getValidationMsg("basic_number");
		this.errors.email = this.validator.getValidationMsg("email");
		this.errors.password = this.validator.getValidationMsg("password");

		this.passwordFormState.oldPassword.error =  this.errors.password;
		this.passwordFormState.newPassword.error =  this.errors.password;
		this.passwordFormState.newPasswordConfirm.error =  this.errors.password;
	}

	ngOnInit() {
		// handle resolver data
		this.route.data.subscribe((data:Data) => {
			let response = data['recoveryOptions'];

			this.processRecoveryOptions(response);     //process response
		});
		// this.http.retrieveRecoveryOptions()
		// .subscribe((response:any)=>{
		// 	this.processRecoveryOptions(response)
		// })
	}

	//process recovery options
	public processRecoveryOptions(response) {
		if(response.response == "okay") {
			let form = response.data.fetched ? response.data.fetched :{};
			this.formState.telephone = form.number ? form.number : "";
			this.formState.email = form.email ? form.email : "";
		}
	}

	public submitRecoveryOptions()
	{
		//continue if form is valid
		if (this.form.valid)
		{
			//construct final form
			let finalForm = {
				number: this.formState.telephone.trim(),
				email: this.formState.email.trim()
			};

			//submit to server
			this.http.submitRecoveryOptions(finalForm)
				.subscribe((response: any) => {
					if(response.response == "okay") {
						this.notification.setSuccessNotification("Recovery options successfully updated");
					}
					else if (response.response == "form") {
						this.notification.notifyError(response.msg);
					}
				});
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
			if(!this.validator.passwordStrongEnough(this.passwordFormState.newPassword.value)){
				//check whether new password is strong enough
				this.isNewPassStrongEnough = false;
				this.passwordFormState.newPassword.error = this.validator.getValidationMsg("strong_password");
			}
			else{
				this.isNewPassStrongEnough = true;
				//reset password error to normal password validation
				this.passwordFormState.newPassword.error = this.validator.getValidationMsg("password");
				
				//check new password usage on server(usage by user)
				this.checkNewPassword();
			}
		}
		else {
			//set password error to normal password validation
			this.passwordFormState.newPassword.error = this.validator.getValidationMsg("password");
		}
	}

	//compare password with retyped one
	public onPasswordConfirm():void
	{
		//only check password comparison if valid
		//noinspection TypeScriptUnresolvedVariable
		if(this.passwordForm.controls.newPasswordConfirm.valid)
		{
			if(this.passwordFormState.newPassword.value !== this.passwordFormState.newPasswordConfirm.value){
				//set form validity and error message
				this.passwordFormState.newPasswordConfirm.error = this.validator.getValidationMsg("passwordMismatch");
				this.passwordFormState.newPasswordConfirm.valid = false;
				this.passwordForm.controls['newPasswordConfirm'].setErrors({'incorrect':true})

			}else {
				this.passwordFormState.newPasswordConfirm.valid = true;
			}
		}//end of valid
	}//end of method
	
	//check old password on the server if correct
	public checkOldPassword()
	{
		//make sure old password is valid
		//noinspection TypeScriptUnresolvedVariable
		if(this.passwordForm.controls.oldPassword.valid)
		{
			let form = {
				oldPassword: this.passwordFormState.oldPassword.value
			};

			//checking server password
			this.isServerCheckingOldPass = true;
			
			//check old password on server if correct
			this.http.checkOldCurrentPassword(form)
				.subscribe((response:any)=>
				{
					this.isServerCheckingOldPass = false;
					this.checkedServerOldPass = true; //has checked old password

					if(response.response == "okay")
					{
						//do nothing if old password is valid
						if(response.data.fetched.validPassword) {
							this.passwordFormState.oldPassword.valid = true;
						}
						else {
							this.passwordFormState.oldPassword.valid = false;
							this.passwordFormState.oldPassword.error = this.validator.getValidationMsg("passwordIncorrect");
							this.passwordForm.controls['oldPassword'].setErrors({'incorrect':true})
						}
					}
					else if(response.response == "form"){
						this.passwordFormState.oldPassword.valid = false;
						this.passwordFormState.oldPassword.error = response.msg;
						this.passwordForm.controls['oldPassword'].setErrors({'incorrect':true})
					}
				});//end of subscribe
		}//end of valid old password
	}

	//check if new password exits(or has been already used) on the server
	public checkNewPassword()
	{
		//check if new password exits(or has been already used)
		//noinspection TypeScriptUnresolvedVariable
		if(this.passwordForm.controls.newPassword.valid)
		{
			let form = {
				newPassword: this.passwordFormState.newPassword.value
			};

			//checking server password
			this.isServerCheckingNewPass = true;

			//server request
			this.http.checkNewPasswordExist(form)
				.subscribe((response:any)=>
				{
					this.isServerCheckingNewPass = false;
					this.checkedServerNewPass = true; //has checked new password

					if(response.response == "okay")
					{
						//do nothing if new password does not exist(hasn't been used)
						if(!response.data.fetched.exists) {
							this.passwordFormState.newPassword.valid = true;
						}
						else if(response.data.fetched.exists) {
							this.passwordFormState.newPassword.valid = false;
							this.passwordFormState.newPassword.error = this.validator.getValidationMsg("passwordExists");
							this.passwordForm.controls['newPassword'].setErrors({'incorrect':true})
						}
					}
					else if(response.response == "form"){
						this.passwordFormState.newPassword.valid = false;
						this.passwordFormState.newPassword.error = response.msg;
						this.passwordForm.controls['newPassword'].setErrors({'incorrect':true})
					}
				});//end of subscribe
		}//end of valid new password
	}

	public submitChangePassword()
	{
		//basic password validation is handled by angular, the extra measures
		//passwords(old and new) must be checked by server, and new password must be strong and match confirm
		if(this.passwordForm.valid && !this.isServerCheckingOldPass && !this.isServerCheckingNewPass && 
			this.checkedServerOldPass && this.checkedServerNewPass &&
			this.passwordFormState.oldPassword.valid && this.isNewPassStrongEnough &&
			this.passwordFormState.newPassword.valid && this.passwordFormState.newPasswordConfirm.valid)
		{
			let form = {
				oldPassword: this.passwordFormState.oldPassword.value,
				newPassword: this.passwordFormState.newPassword.value,
				confirmNewPassword: this.passwordFormState.newPasswordConfirm.value
			};

			//submit change password.
			this.http.submitChangePassword(form)
				.subscribe((response: any) =>
				{
					if (response.response == "okay") {
						this.notification.setSuccessNotification("Password successfully changed");
						//reset form values
						this.passwordFormState.oldPassword.value="";
						this.passwordFormState.newPassword.value=""
						this.passwordFormState.newPasswordConfirm.value=""
						//reset some key variables needed
						//this will make the user re-check the old and new password if changing again.
						this.checkedServerOldPass = false;
						this.checkedServerNewPass = false;
					}
					else if (response.response == "form") {
						this.passwordFormState.newPassword.valid = false;
						this.passwordFormState.newPassword.error = response.msg;
						this.passwordForm.controls['newPassword'].setErrors({'incorrect':true})

					}
				});//end of subscribe
		}//end of validation passed
	}

	//collapse recovery options form
	public recoveryCollapse() {
		//trigger class to hide form
		this.hideRecovery = !this.hideRecovery
	}

	//collapse password change form
	public changePasswordCollapse() {
		//trigger class to hide form
		this.hideChangePassword = !this.hideChangePassword;
	}
}
