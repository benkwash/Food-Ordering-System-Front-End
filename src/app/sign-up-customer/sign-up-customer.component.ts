import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from "@angular/forms";

//services
import { CustomValidatorsService } from "../services/other/custom-validators.service";
import { AppBackendOperationsService } from "../services/http/app-backend-operations.service";
import { AppDataService } from "../services/data/app-data.service";
import { AuthenticationService } from "../services/other/authentication.service";
import { PushNotificationService } from "../services/other/push-notifications.service";

@Component({
	selector: 'app-sign-up-customer',
	templateUrl: './sign-up-customer.component.html',
	styleUrls: ['./sign-up-customer.component.css']
})
export class SignUpCustomerComponent implements OnInit {
	@ViewChild('form') form: NgForm;
	@ViewChild('form1') form1: NgForm;
	@ViewChild('recoveryForm') recoveryForm: NgForm;

	//enforce agreement(by either accepting or declining
	// @Input() enforceAgreement:boolean = false; 

	//default sign up phase
	public signUpPhase: number = 1;

	public popTermsConditionsTemplate: any;
	public openPopOver: any;

	public formState = {
		valid: true,
		fName: { value: "", valid: true, error: "Provide a valid name" },
		lName: { value: "", valid: true, error: "Provide a valid name" },
		email: { value: "", valid: true, error: "" },
		password: { value: "", valid: true, error: "" },
		passwordConfirm: { value: "", valid: true, error: "" }
	};

	//password toggles
	public passwordView: boolean = false;
	public confirmPasswordView: boolean = false;

	public isPasswordStringEnough: boolean = true;
	public isCheckingEmail: boolean = false;
	public nameRegex: string;
	public emailRegex: string;
	public emailErrMsg: string;
	public passwordRegex: string;
	public numberRegex: string;
	public numberErrMsg: string;

	public showTermsComponent: boolean = false;
	public agreeToTermsValidate: boolean = false;

	//PHASE TWO: ADMIN ACCOUNT VERIFICATION
	public verificationCode: string = "";
	public verificationID: string = "";
	public emailVerificationSent: boolean = false;
	public verificationCodeSubmitBtnClicked: boolean = false;
	public verificationCodeValid: boolean = false;
	public verificationCodeErrMsg: string = "";

	//track a server submit in progress
	public isSubmitting: boolean = false;

	//PHASE THREE: RECOVERY OPTIONS
	public recoveryOptions = {
		number: "", email: ""
	};

	//user route paths
	public resUrl: string = "";
	public userPathUrl: string = "";


	public queryParameters = {
		restaurantID: null,
		city: null
	}
	constructor(private customValidate: CustomValidatorsService,
		private appHttpOp: AppBackendOperationsService, private router: Router,
		private appData: AppDataService, private authService: AuthenticationService,
		private notification: PushNotificationService, private route: ActivatedRoute) {
		this.nameRegex = this.customValidate.nameRegex();
		this.emailRegex = this.customValidate.emailRegex();
		this.passwordRegex = this.customValidate.passwordRegex();
		this.numberRegex = this.customValidate.numberRegex();

		this.formState.fName.error = this.customValidate.getValidationMsg("name");
		this.formState.lName.error = this.customValidate.getValidationMsg("name");
		this.formState.password.error = this.customValidate.getValidationMsg("password");
		this.formState.passwordConfirm.error = this.customValidate.getValidationMsg("password");
		this.formState.email.error = this.customValidate.getValidationMsg("email");

		this.numberErrMsg = this.customValidate.getValidationMsg("number");
		this.emailErrMsg = this.customValidate.getValidationMsg("email");

		this.verificationCodeErrMsg = this.customValidate.getValidationMsg("code");
	}

	ngOnInit() {

		let query: any = this.route.snapshot.queryParams
		this.queryParameters = query;
	}


	//perform a quick server check for username whether it exists or not
	public onEmailChange(): void {
		//noinspection TypeScriptUnresolvedVariable
		if (this.form.controls.email.valid) {
			this.isCheckingEmail = true;

			//make http call to server checking whether username exists or not
			this.appHttpOp.checkEmailExistence(this.formState.email.value.trim())
				.subscribe((response: any) => {
					this.isCheckingEmail = false;

					if (response.response == "form") {
						this.formState.email.valid = false;
						this.formState.email.error = response.msg;
					}
					else if (response.response == "okay") {
						//check the exists property
						if (response.data.fetched.exists) {
							this.formState.email.error = this.customValidate.getValidationMsg('emailExists');
							this.formState.email.valid = false;
							this.form.controls['email'].setErrors({ 'incorrect': true })
						} else {
							this.formState.email.error = "";
							this.formState.email.valid = true;
						}
					}
				});
		} else this.formState.email.error = this.customValidate.getValidationMsg("email");
	}//end of method

	public openTermsAndConditions(): void {
		this.showTermsComponent = true;
	}

	//process change terms and condition accept status
	public processAcceptTermsStatus(status) {
		//true for accepted and false for rejected
		this.agreeToTermsValidate = status;

		//hide terms component
		this.showTermsComponent = false;
	}

	//process toggling of agree checkbox by user
	public processAgreeCheckboxChange(event) {
		//reject the manually setting to true
		// (only done when user accepts terms and conditions)
		if (!event) {
			this.agreeToTermsValidate = false;
		}
		else {
			//when setting to true, negate the original value
			// before re-negating to give the original value
			let that = this;

			//negate the original status
			this.agreeToTermsValidate = !this.agreeToTermsValidate;

			//trigger a change detection;
			setTimeout(function () {
				//re-negate the current value to give the original value.
				that.agreeToTermsValidate = !that.agreeToTermsValidate;
			}, 1);
		}
	}

	//check whether new password is valid not the username and is
	// strong enough to be used
	public validateNewPassword(): void {
		//password must be valid first
		//noinspection TypeScriptUnresolvedVariable
		if (this.form.controls.password.valid) {
			if (this.formState.password.value == this.formState.email.value) {
				this.isPasswordStringEnough = false;
				this.form.controls['password'].setErrors({ 'incorrect': true })
				this.formState.password.error = this.customValidate.getValidationMsg("password_not_username");
			}
			else if (!this.customValidate.passwordStrongEnough(this.formState.password.value)) {
				//check whether password is strong enough
				this.isPasswordStringEnough = false;
				this.form.controls['password'].setErrors({ 'incorrect': true })
				this.formState.password.error = this.customValidate.getValidationMsg("strong_password");
			}
			else {
				this.isPasswordStringEnough = true;
				//reset password error to normal password validation
				this.formState.password.error = this.customValidate.getValidationMsg("password");
			}
		}
		else {
			//set password error to normal password validation
			this.formState.password.error = this.customValidate.getValidationMsg("password");
		}
	}

	//compare password with retyped one
	public onPasswordConfirm(): void {
		//only check password comparison if valid
		//noinspection TypeScriptUnresolvedVariable
		if (this.form.controls.confirmPassword.valid) {
			if (this.formState.password.value !== this.formState.passwordConfirm.value) {
				//set form validity and error message
				this.form.controls['confirmPassword'].setErrors({ 'incorrect': true })
				this.formState.passwordConfirm.error = this.customValidate.getValidationMsg("confirmPassword");
				this.formState.passwordConfirm.valid = false;
			} else {
				this.formState.passwordConfirm.valid = true;
			}
		}//end of valid
	}//end of method

	//submit signUp
	public onSubmitSignUp() {
		// only password will require other checks(toggling their validations).
		// the rest will be validated by angular with ngModel and set the form status
		// so form.valid will do for them.
		if (this.form.valid && this.formState.email.valid &&
			this.formState.passwordConfirm.valid
			// && this.agreeToTermsValidate 
			&& !this.isSubmitting) {
			this.isSubmitting = true;

			let formToSubmit = {
				fName: this.formState.fName.value.trim(),
				lName: this.formState.lName.value.trim(),
				email: this.formState.email.value.trim().toLowerCase(),
				accountType: "customer",
				password: this.formState.password.value,
				passwordConfirm: this.formState.passwordConfirm.value
			};

			//submit signup information
			//move to phase two(i.e. verifying admin account)
			this.appHttpOp.submitCustomerSignUp(formToSubmit)
				.subscribe((response: any) => {
					this.isSubmitting = false;

					if (response.response == "okay") {
						//retrieve the server results and move to phase two.
						let fetched: any = response.data.fetched ? response.data.fetched : {};

						this.emailVerificationSent = fetched.emailSent ? true : false;
						this.verificationID = fetched.userID ? fetched.userID : "";

						//move to  phase 2
						this.signUpPhase = 2;
					}
					else if (response.response == "form") {
						this.formState.fName.error = response.form.fName.error;
						this.formState.lName.error = response.form.lName.error;
						this.formState.password.error = response.form.password.error;
						this.formState.passwordConfirm.error = response.form.passwordConfirm.error;
					}
				});
		}
	}

	//resent verification email
	public resendVerificationEmail(): void {
		if (!this.isSubmitting) {
			this.isSubmitting = true;

			//resend admin account email verification
			this.appHttpOp.resendCustomerAcctVerification(this.verificationID)
				.subscribe((response: any) => {
					this.isSubmitting = false;

					if (response.response == "okay") {
						let fetched: any = response.data.fetched ? response.data.fetched : {};

						this.emailVerificationSent = fetched.emailSent ? true : false;
					}
					else if (response.response == "form") {
						this.notification.notifyError(response.msg);
					}
				});
		}
	}

	public onChangeVerification(): void {
		this.verificationCodeSubmitBtnClicked = false;
		this.verificationCodeErrMsg = this.customValidate.getValidationMsg("code");
	}

	//verify admin account with verification code
	public onSubmitVerificationCode() {
		this.verificationCodeSubmitBtnClicked = true;

		//validate verification code
		if (this.verificationCode && !this.isSubmitting) {
			this.isSubmitting = true;
			this.verificationCodeValid = true;

			//submit admin verification account and if verified, move to the third phase
			this.appHttpOp.submitCustomerAcctVerification(this.verificationID, this.verificationCode)
				.subscribe((response: any) => {
					console.log(response);
					this.isSubmitting = false;

					if (response.status == 200 && response.response == "okay") {
						let fetched: any = response.data.fetched ? response.data.fetched : {};

						if (!fetched.verified) {
							this.verificationCodeValid = false;
							this.verificationCodeErrMsg = this.customValidate.getValidationMsg("incorrect_code");
							this.form1.controls['verificationCode'].setErrors({ 'incorrect': true })
						}
						else {
							//account verified
							this.notification.setSuccessNotification("Verification was successful.");

							//add user account information for authentication
							this.appData.setUserToken(response.data.token);
							this.appData.setAccountType(response.data.path);
							this.appData.setUrl(response.data.other.url);

							this.authService.signUserIn(); //signUser in;

							// this.resUrl = response.data.other.url;
							// this.userPathUrl = response.data.path;


							//move to the next phase(recovery options)
							// this.signUpPhase = 3;

							if (this.queryParameters.city && this.queryParameters.restaurantID) {
								this.router.navigate(['/customer/restaurantmenu'], {
									queryParams: {
										restaurantID: this.queryParameters.restaurantID,
										city: this.queryParameters.city
									}
								})
							} else this.router.navigate(['/customer/myorders']);

						}
					}
					else if (response.response == "form") {
						this.notification.notifyError(response.msg);
					}
				});//end of subscribe
		}//end of valid
	}

	//update recovery options
	public updateRecoveryOptions() {
		//check form validity
		//form must be valid and at least one of the recovery options has to be available
		if (!this.isSubmitting && this.recoveryForm.valid &&
			(this.recoveryOptions.number || this.recoveryOptions.email)) {
			this.isSubmitting = true;

			let form = {
				email: this.recoveryOptions.email.trim(),
				number: this.recoveryOptions.number.trim()
			};

			//update user's recovery options and redirect to admin's welcome page.
			this.appHttpOp.submitRecoveryOptions(form)
				.subscribe((response: any) => {
					this.isSubmitting = false;
					if (response.response == "okay") {
						let fetched: any = response.data.fetched ? response.data.fetched : {};

						//check if recovery options was updated
						if (fetched.isUpdated) {
							this.notification.setSuccessNotification("Updated recovery options");

							// now finally redirect user to the welcome page
							this.router.navigate([this.resUrl, this.userPathUrl, "welcome"]);
						}
					}
					else if (response.response == "form") {
						this.notification.notifyError(response.msg);
					}
				});//end of subscribe
		}
	}

	public goToPreviousPhase() {
		if (this.signUpPhase > 1)
			this.signUpPhase -= 1;
	}
}
