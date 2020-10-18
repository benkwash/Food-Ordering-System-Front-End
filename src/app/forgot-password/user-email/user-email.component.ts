import { Component, OnInit, ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";

import {CustomValidatorsService} from "../../services/other/custom-validators.service";
import {AppBackendOperationsService} from "../../services/http/app-backend-operations.service";
import {PushNotificationService} from "../../services/other/push-notifications.service";
import {AccountRecoverProcessService} from "../../services/data/account-recover-process.service";

@Component({
	selector: 'app-user-email',
	templateUrl: './user-email.component.html',
	styleUrls: [
		'./user-email.component.css',
		'../../sign-up/sign-up.component.css'
	]
})
export class UserEmailComponent implements OnInit {

	//email sending
	public email:string = ""; //main email.
	public userEmail = "";
	public recoveryEmail = "";
	public userName = "";
	public isSubmitting:boolean = false;

	//recovery code
	@ViewChild("codeForm") recoveryCodeForm:NgForm;
	public recoveryCodeInputDisplay:boolean = false;
	public recoveryCode:string = "";
	public recoveryCodeSent:boolean = false;
	public recoveryCodeValid:boolean = false;
	public recoveryCodeError:string = "";

	constructor(private validator:CustomValidatorsService, private http:AppBackendOperationsService,
					private router:Router, private notification:PushNotificationService,
					private acctRecover:AccountRecoverProcessService) {}

	ngOnInit()
	{
		//check if the first phase was completed
		if(this.acctRecover.isPhaseCompleted("forgetPassword"))
		{
			//retrieve the saved username(may also be a password
			this.userName = this.acctRecover.getUserInformation("username");

			//check if recovery specs has userEmail
			let hasUserEmail = this.acctRecover.getUserInformation("recoverySpecs.userEmail");
			this.userEmail = (hasUserEmail && this.validator.email(this.userName)) ? this.userName : "";

			//retrieve user email and recovery email
			let recoveryOptions = this.acctRecover.getUserInformation("recoveryOptions");
			this.recoveryEmail = (recoveryOptions.email && this.validator.email(recoveryOptions.email))
				? recoveryOptions.email : "";

			//set the email to display(either userEmail or recovery email)
			//if none is available, move try another option
			if(this.userEmail)
				this.email = this.userEmail;
			else if(this.recoveryEmail)
				this.email = this.recoveryEmail;
			else
				this.getNextRecoveryOption();
		}
		else {
			//redirect to phase 1 (forget-password phase) if not completed
			this.router.navigate(['account']);
		}
	}

	//get the next recovery option
	public getNextRecoveryOption() {
		//allow the sending of email to either the userEmail or recovery email
		//if using, userEmail, next phase is the recovery email else navigate away.
		//if not userEmail, then it may be the recovery email so the next phase should navigate away.
		this.recoveryCodeInputDisplay = false;
		if(this.email === this.userEmail && this.recoveryEmail) {
			this.email = this.recoveryEmail;
		}
		else {
			const url = this.acctRecover.getNextRecoveryPhaseUrl("recoveryEmail");
			this.router.navigateByUrl(url);
		}
	}

	//get the previous recovery option
	public getPreviousRecoveryOption() {
		//allow the sending of email to either the userEmail or recovery email
		//if using, recoveryEmail, previous phase is the userEmail if available.
		//if not recoveryEmail, then it may be user email so the previous phase should navigate away.
		this.recoveryCodeInputDisplay = false;
		if(this.email ===  this.recoveryEmail && this.userEmail){
			this.email = this.userEmail;
		}
		else {
			const url = this.acctRecover.getPrevRecoveryPhaseUrl("recoveryEmail");
			this.router.navigateByUrl(url);
		}
	}
	
	//send recovery code
	public sendRecoveryCodeMail()
	{
		if(!this.isSubmitting)
		{
			let form = {
				username:this.userName, userEmail:this.email
			};

			//submit recovery code to backend
			this.http.sendRecoveryCodeToEmail(form)
				.subscribe((response:any)=>
				{
					//process response
					if(response.response=="okay")
					{
						//check if email was sent or not.
						if(response.data.fetched.emailSent){
							this.recoveryCodeInputDisplay = true;
						}
						else {
							//email not sent
							this.notification.notifyError("Recovery email not sent.");
						}
					}
					else if(response.response == "form") {
						this.notification.notifyError(response.msg);
					}
				});//end of subscribe
		}//end of not submitting
	}

	public submitRecoveryCode()
	{
		//validate code..if valid, continue
		if(this.recoveryCodeForm.valid)
		{
			//construct form
			let form = {
				recoveryCode:this.recoveryCode, username:this.userName
			};

			this.recoveryCodeSent = false;
			this.http.submitRecoveryCode(form)
				.subscribe((response:any)=>
				{
					this.recoveryCodeSent = true;
					if(response.response == "okay")
					{
						if(response.data.fetched.valid)
						{
							//save phase completion
							this.acctRecover.setPhaseCompletion("emailRecoveryCode");

							//set recovery info
							this.acctRecover.setUserInformation("emailRecoveryCode",this.recoveryCode);

							//navigate to set new password page if old password is valid
							this.router.navigate(["/account/recover/new_password"]);
						}
						else if(response.data.fetched.expired) {
							this.recoveryCodeValid = false;
							this.recoveryCodeError = "Recovery code has expired. Please resend a new one.";
							this.recoveryCodeForm.controls['recoveryCode'].setErrors({'incorrect':true})
						}
						else {
							this.recoveryCodeValid = false;
							this.recoveryCodeError = "Recovery code is incorrect.";
							this.recoveryCodeForm.controls['recoveryCode'].setErrors({'incorrect':true})
						}
					}
					else if(response.response=="form"){
						this.recoveryCodeValid = false;
						this.recoveryCodeError = response.msg;
						this.recoveryCodeForm.controls['recoveryCode'].setErrors({'incorrect':true})
					}
				});//end of subscribe
		}//end of code form valid
	}
}
