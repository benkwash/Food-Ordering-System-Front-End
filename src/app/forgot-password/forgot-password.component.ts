import { Component, OnInit,ViewChild} from '@angular/core';
import {ActivatedRoute,Router} from "@angular/router";
import {NgForm} from "@angular/forms";

import {CustomValidatorsService} from "../services/other/custom-validators.service";
import {AppBackendOperationsService} from "../services/http/app-backend-operations.service";
import {AccountRecoverProcessService} from "../services/data/account-recover-process.service";

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: [
		'./forgot-password.component.css',
		'../sign-up/sign-up.component.css'
	]
})
export class ForgotPasswordComponent implements OnInit {
	//recovery form
	@ViewChild('form') form:NgForm;

	//data from form
	public username = "";
	public usernameValid:boolean = true;
	public usernameError = "";
	public usernameRegex = "";

	constructor(private router:Router, private http:AppBackendOperationsService,
					private validator:CustomValidatorsService, private acctRecover:AccountRecoverProcessService) {
		this.usernameRegex = this.validator.usernameRegex();
		this.usernameError = this.validator.getValidationMsg("email");
	}

	ngOnInit() {}

	public submitUsername()
	{
		//validate field.if valid, continue
		if(this.form.valid)
		{
			//submit username to backend
			this.http.confirmUsername(this.username)
				.subscribe((response:any)=>
				{
					console.log(response)
					if(response.response=="okay")
					{
						let fetched:any = response.data.fetched ? response.data.fetched : {};

						//check whether user name indeed has been confirmed
						let confirmed = fetched.exist ? true : false;

						//username has been confirmed then retrieve recovery specs and options
						if(confirmed)
						{
							//holds specifications for ways the account can be recovered
							let recoverySpecifications:any = fetched.recoverySpecs ? fetched.recoverySpecs : {};
							let recoveryOptions:any = fetched.recoveryOptions ? fetched.recoveryOptions : {};
							let userType = fetched.userType ? fetched.userType : "";

							//before redirecting, set phase completed and user data
							this.acctRecover.setUserInformation("username",this.username);
							this.acctRecover.setUserInformation("userType",userType);
							this.acctRecover.setUserInformation("recoverySpecs",recoverySpecifications);
							this.acctRecover.setUserInformation("recoveryOptions",recoveryOptions);

							//set phase completion
							this.acctRecover.setPhaseCompletion("forgetPassword");

							//navigate to the next recovery phase
							const url = this.acctRecover.getNextRecoveryPhaseUrl("forgetPassword");
							this.router.navigateByUrl(url);
						}
					}
					else if(response.response=="form"){

						//handle form errors
						if(this.usernameError) {
							this.usernameValid = false;
							this.usernameError = response.form.usernameError;
							this.form.controls['username'].setErrors({'incorrect':true})

						}
					}
				});
		}
	}//end of submit
}
