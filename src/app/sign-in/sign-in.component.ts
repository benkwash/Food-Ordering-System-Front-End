import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

import { CustomValidatorsService } from "../services/other/custom-validators.service";
import { AppDataService } from "../services/data/app-data.service";
import { AuthenticationService } from "../services/other/authentication.service";
import { AppBackendOperationsService } from "../services/http/app-backend-operations.service";
import { PushNotificationService } from "../services/other/push-notifications.service";

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: [
		'./sign-in.component.css',
		'../sign-up/sign-up.component.css'
	]
})
export class SignInComponent implements OnInit, OnDestroy {

	//error vars
	public formState = {
		valid: true,
		userName: { value: "", valid: true, error: "" },
		password: { value: "", valid: true, error: "" }
	};

	public rememberMe: boolean = false;
	public usernameRegex: string;
	public emailRegex: string;
	public passwordRegex: string;
	@ViewChild('form') form: NgForm;
	public formClicked = false;
	public referrerUrl: string = null;
	private tempSubscription: Subscription;


	public queryParameters = {
		restaurantID: null,
		city: null
	}
	constructor(private customValidate: CustomValidatorsService, private appHttpOp: AppBackendOperationsService,
		private appData: AppDataService, private authService: AuthenticationService,
		private router: Router, private route: ActivatedRoute,
		private notifications: PushNotificationService) {
		this.usernameRegex = this.customValidate.usernameRegex();
		this.passwordRegex = this.customValidate.passwordRegex();
		this.emailRegex = this.customValidate.emailRegex();
		this.formState.userName.error = this.customValidate.getValidationMsg("username");
		this.formState.password.error = this.customValidate.getValidationMsg("password");
	}

	ngOnInit() {
		let query: any = this.route.snapshot.queryParams
		this.queryParameters = query;
		//if remember me is set by default, use it and check the form.
		this.route.queryParams.subscribe((data: any) => {
			if (data.remember_me && data.remember_me == "true") {
				this.rememberMe = true;
			}

			//set the url referrer url
			if (data.referrerUrl) {
				this.referrerUrl = data.referrerUrl;
			}

			// console.log(data.referrerUrl)
			//NOTE
			//stopDefault query property is available when server auth fails and auth interceptor
			//redirects to the login.
			//if query parameter contains a property stopDefault, do not automatically
			//attempt logging user into his/her account even though an account may exist
			//only perform automated login in if no stopDefault exist
			if (!data.stopDefault) {
				//maybe a previously saved information exist, so let's use that one instead
				let canAuthenticate = this.authService.isAuthenticated();
				if (canAuthenticate) {
					const mainMsg = "Use saved login information ?";
					const confirmMsg = "";
					this.tempSubscription = this.notifications.customConfirmDialogueBox([mainMsg, confirmMsg])
						.subscribe((confirm) => {
							//confirmed by user
							if (confirm) {
								let url = "restaurant";
								//get user account type
								let isStaff = this.authService.isStaff();
								let isAdmin = this.authService.isAdmin();

								if (isAdmin) {
									this.router.navigate([url, "admin", "home"]);
								} else if (isStaff) {
									this.router.navigate([url, "staff", "home"]);
								} else {

									if (this.queryParameters.city != null && this.queryParameters.restaurantID != null) {
										this.router.navigate(['customer','restaurantmenu'], {
											queryParams: {
												restaurantID: this.queryParameters.restaurantID,
												city: this.queryParameters.city
											}
										})
									} else this.router.navigate(["customer", "myorders"]);
								}
							}

							//subscribe only once(prevent multiple subscriptions)
							this.tempSubscription.unsubscribe();
						});
				}
			}//stop default
		});
	}

	//remember user
	// public onRememberMe(event):void {
	// 	//target checked is a boolean(true/false)
	// 	console.log(this.rememberMe)
	// }//end of method

	//submit sign in form
	public onSubmit() {
		this.formClicked = true;
		// console.log(this.form);
		if (this.form.valid) {
			let submittedForm = {
				email: this.formState.userName.value.trim().toLowerCase(),
				password: this.formState.password.value,
				rememberMe: this.rememberMe ? "t" : "f"
			};

			//reset formState username error and validity before submit
			this.formState.userName.valid = true;
			this.formState.userName.error = "";

			//submit signup information
			this.appHttpOp.submitSignIn(submittedForm)
				.subscribe((response: any) => {
					// console.log(response);
					if (response && response.status == 200 && response.response == "okay") {
						//make necessary assignments
						let path = response.data.path ? response.data.path : "";

						let other: any = response.data.other ? response.data.other : {};
						let url = other && other.url ? other.url : "";
						let restaurantID = other && other.restaurantID ? other.restaurantID : "";
						let userID = other && other.userID ? other.userID : "";

						//authentication class should go here
						this.appData.setUserToken(response.data.token);
						this.appData.setAccountType(path);
						this.appData.setUrl(url);
						this.authService.signUserIn(); //signUser in;

						//if user is staff, set staff account permissions
						if (path == "staff") {
							this.appData.setStaffPermissions(response.data.other.staffPermissions);
							this.authService.setStaffPermissionsStorage()
						}


						//reroute user to respective portals
						//or to referrer url if it exists
						if (this.referrerUrl)
							this.router.navigateByUrl(this.referrerUrl);
						else if (path != "customer")
							this.router.navigate([url, path, "home"]);
						else {
							if (this.queryParameters.city && this.queryParameters.restaurantID) {
								this.router.navigate(['customer','restaurantmenu'], {
									queryParams: {
										restaurantID: this.queryParameters.restaurantID,
										city: this.queryParameters.city
									}
								})
							} else this.router.navigate(["customer", "myorders"]);
						}

					}
					else if (response.response == "form") {
						this.formState.userName.valid = response.form.email.valid;
						this.formState.userName.error = response.form.email.error;
						this.formState.password.valid = response.form.password.valid;
						this.formState.password.error = response.form.password.error;
						this.form.controls['password'].setErrors({ 'incorrect': true })

					}
				});
		}
	}

	ngOnDestroy() {
		//prevent memory leaks
		if (this.tempSubscription)
			this.tempSubscription.unsubscribe();
	}
}
