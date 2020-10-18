import { Component, OnInit,ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";

import {CustomValidatorsService} from "../../services/other/custom-validators.service";
import {AppBackendOperationsService} from "../../services/http/app-backend-operations.service";
import {PushNotificationService} from "../../services/other/push-notifications.service";
import {AccountRecoverProcessService} from "../../services/data/account-recover-process.service";

@Component({
	selector: 'app-user-number',
	templateUrl: './user-number.component.html',
	styleUrls: [
		'./user-number.component.css',
		'../../sign-up/sign-up.component.css'
	]
})
export class UserNumberComponent implements OnInit {

	public recoveryNumber:string = "";
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
			
			//retrieve user email and recovery email
			let recoveryOptions = this.acctRecover.getUserInformation("recoveryOptions");
			this.recoveryNumber = recoveryOptions.number ? recoveryOptions.number : "";

			//move to the next option if no recovery number is available
			if(!this.recoveryNumber)
				this.getNextRecoveryOption();
		}
		else {
			//redirect to phase 1 (forget-password phase) if not completed
			this.router.navigate(['account']);
		}
	}

	//get the next recovery option
	public getNextRecoveryOption() {
		this.recoveryCodeInputDisplay = false;
		const url = this.acctRecover.getNextRecoveryPhaseUrl("recoveryNumber");
		this.router.navigateByUrl(url);
	}

	//get the previous recovery option
	public getPreviousRecoveryOption() {
		this.recoveryCodeInputDisplay = false;
		const url = this.acctRecover.getPrevRecoveryPhaseUrl("recoveryNumber");
		this.router.navigateByUrl(url);
	}

	//send recovery code
	public sendRecoveryCodeNumber()
	{
		if(!this.isSubmitting)
		{
			let form = {
				username:this.userName, number:this.recoveryNumber
			};

			//submit recovery code number to backend
			this.http.sendRecoveryCodeToNumber(form)
				.subscribe((response:any)=>
				{
					//process response
					if(response.response=="okay")
					{
						//check if message was sent or not.
						if(response.data.fetched.messageSent){
							this.recoveryCodeInputDisplay = true;
						}
						else {
							//phone message not sent
							this.notification.notifyError("Recovery message not sent.");
						}
					}
					else if(response.response == "form") {
						this.notification.notifyError(response.msg);
					}
				});//end of subscribe
		}//end of not submitting
	}

	public submitNumberRecoveryCode()
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
							this.acctRecover.setPhaseCompletion("recoveryNumber");

							//set recovery info
							this.acctRecover.setUserInformation("recoveryNumber",this.recoveryCode);

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
