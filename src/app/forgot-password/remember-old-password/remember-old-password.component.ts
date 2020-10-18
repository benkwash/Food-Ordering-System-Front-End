import { Component, OnInit,ViewChild} from '@angular/core';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";

import {CustomValidatorsService} from "../../services/other/custom-validators.service";
import {AppBackendOperationsService} from "../../services/http/app-backend-operations.service";
import {AccountRecoverProcessService} from "../../services/data/account-recover-process.service";

@Component({
	selector: 'app-remember-old-password',
	templateUrl: './remember-old-password.component.html',
	styleUrls: [
		'./remember-old-password.component.css',
		'../../sign-up/sign-up.component.css'
	]
})
export class RememberOldPasswordComponent implements OnInit {
	@ViewChild("form") form:NgForm;

	public passwordRegex:string = "";
	public oldPassword:string = "";
	public oldPasswordValid:boolean = true;
	public oldPasswordError:string = "";

	public userName:string = "";

	constructor(private validator:CustomValidatorsService, private http:AppBackendOperationsService,
					private router:Router, private acctRecover:AccountRecoverProcessService) {
		this.passwordRegex = this.validator.passwordRegex();
		this.oldPasswordError = this.validator.getValidationMsg("password");
	}

	ngOnInit()
	{
		//check if the first phase was completed
		if(this.acctRecover.isPhaseCompleted("forgetPassword")) {
			//retrieve the saved username
			this.userName = this.acctRecover.getUserInformation("username");
		}
		else {
			//redirect to phase 1 (forget-password phase) if not completed
			this.router.navigate(['account']);
		}
	}

	public getNextOption() {
		const url = this.acctRecover.getNextRecoveryPhaseUrl("oldPassword");
		this.router.navigateByUrl(url);
	}
	
	public getPreviousOption() {
		const url = this.acctRecover.getPrevRecoveryPhaseUrl("oldPassword");
		this.router.navigateByUrl(url);
	}
	
	//if user remembers and tries use this option(provides an old password
	public submitOldPassword()
	{
		//validate form first
		if(this.form.valid)
		{
			//construct form
			let form = {
				username:this.userName,
				password:this.oldPassword
			};

			//check old password
			this.http.checkOldPassword(form)
				.subscribe((response:any)=>
				{
					if(response.response=="okay")
					{
						if(response.data.fetched.valid)
						{
							//save phase completion
							this.acctRecover.setPhaseCompletion("oldPassword");

							//set recovery info
							this.acctRecover.setUserInformation("oldPassword",this.oldPassword);

							//navigate to set new password page if old password is valid
							this.router.navigate(["/account/recover/new_password"]);
						}
						else {
							this.oldPasswordValid = false;
							this.oldPasswordError = "does not match any older password";
							this.form.controls['password'].setErrors({'incorrect':true})
						}
					}
					else if(response.response == "form") {
						this.oldPasswordValid = false;
						this.oldPasswordError = response.msg;
						this.form.controls['password'].setErrors({'incorrect':true})
					}
				});//end of subscribe
		}//end of valid
	}
}
