import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router, Data } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Observable, iif } from "rxjs";

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


//services
import { CustomValidatorsService } from "../../services/other/custom-validators.service";
import { PushNotificationService } from "../../services/other/push-notifications.service";
import { GeneralPhotoUploadService } from "../../services/other/general-photo-upload.service";
import { CanComponentDeactivate } from "../../services/other/can-deactivate-guard.service";
import { httpInterceptorProviders } from 'src/app/httpInterceptors';
import { AppBackendOperationsService } from '../../services/http/app-backend-operations.service';
import { ServerDomainService } from "../../services/http/server-domain.service";
import { StaffOperationsService } from '../services/http/staff-operations.service';

//confirmation dialog
import { ConfirmDialogComponent } from "../../general/confirm-dialog/confirm-dialog.component"

@Component({
	selector: "app-staff-dialog",
	templateUrl: 'staff-dialog.component.html',
	styleUrls: [
		"staff-dialog.component.css"
	]
})

export class StaffDialogComponent {

	public newStaffForm = {

		fName: '',
		lName: '',
		sex: '',//m,f
		title: '', //accountant/cheff/waiter/admin/deliveryguy defined by admin or person adding staff
		employeeID: '',
		permissions: {
			staff: false,
			menu: false,
			accounts: false,
			orders: false,
			delivery: false
		}, //staff,menu,accounts,orders,delivery
		address: '',
		email: '',
		tel: {
			number1: "",
			number2: ""
		},
		qualification: "",
		picture: ""

	};

	logoAssestDir = "";
	uploading = false;
	acceptedImageTypes;
	progress;



	public selectedStaff = {
		clickActive: false,
		userID: "",
		fName: '',
		lName: '',
		sex: '',//m,f
		title: '', //accountant/cheff/waiter/admin/deliveryguy defined by admin or person adding staff
		employeeID: '',
		permissions: {
			staff: false,
			menu: false,
			accounts: false,
			orders: false,
			delivery: false
		}, //staff,menu,accounts,orders,delivery
		address: '',
		email: '',
		tel: {
			number1: "",
			number2: ""
		},
		qualification: "",
		picture: "",
		_id: "",
		isDeactivated: false

	};

	// logoAssestDir = "";
	// uploading = false;
	// acceptedImageTypes;
	// progress;

	dialogType: string; //type of dialog

	editStaff = false;

	constructor(
		public dialogRef: MatDialogRef<StaffDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
		public dialog: MatDialog, public http: StaffOperationsService,
		public accountHttp: AppBackendOperationsService,
		private photoUpload: GeneralPhotoUploadService, private validator: CustomValidatorsService,
		private serverDomain: ServerDomainService, private notify: PushNotificationService) {


		this.acceptedImageTypes = this.validator.acceptedImageFileTypes();
		this.logoAssestDir = this.serverDomain.getImgAssetsUrlDir();

		this.dialogType = this.data.dialogType;
		if (this.dialogType == "staffDetail") {
			this.geStaffInfo(this.data.id)
		}

	}

	geStaffInfo(id) {
		this.http.getStaffInfo(id)
			.subscribe((response: any) => {
				if (response.response == "okay") {
					this.selectedStaff = response.data.fetched;
				}
			})
	}


	//on adding a file(image), start uploading file immediately
	public onPhotoAdded(event): void {
		//get photo
		let file = (event.target.files.length > 0) ? event.target.files[0] : false;
		//validate image
		//get selected file (a file should be at selected to proceed
		if (file && this.validator.validateImageFile(file)) {
			// set the component state to "uploading"
			this.uploading = true;

			// start the upload and save the progress map
			this.photoUpload.uploadPhoto(file)
				.subscribe((progresRes) => {
					console.log(progresRes)
					//upload progress -1 means completed otherwise, in progress
					//progresRes is an object {progress:number,response:obj
					if (progresRes.progress != -1) {
						//upload in progress
						this.progress = progresRes.progress;
					}
					else {
						//a progress of -1 is sent just before an upload is successful
						let response: any = progresRes.response.body;
						if (response.status == 200 && response.response == "okay") {
							//everything went fine
							let staffPic = response.data.other.newPhoto;
							if (this.dialogType == "staffDetail") {
								this.selectedStaff.picture = staffPic
								this.updateStaffInfo();
							} else if (this.dialogType == "newStaff") {
								this.newStaffForm.picture = staffPic;
							}

						} else if (response.status == 200 && response.response == "form") {
							this.notify.notifyError(response.msg);
						}
					}//end of upload completion
				}, (err) => {
					//reset upload status & progress
					this.uploading = false;
					this.progress = 0;
				}, () => {
					//reset upload status and progress;
					this.uploading = false;
					this.progress = 0;
				});
		}//end of file validation pass
	}//end of method

	//create new staff
	addNewStaff() {
		this.http.saveStaffInfo(this.newStaffForm)
			.subscribe((response: any) => {
				if (response.response == "okay") {
					this.dialogRef.close(response.data.fetched);
				}
			});
	}
	//create a user account for a staff
	openStaffAccountCreation(): void {
		const createAcc = this.dialog.open(NewStaffDialogComponent, {
			//   width: '250px',
			data: { dialogType: "createAcc", staffName: this.selectedStaff.fName, staffID: this.selectedStaff._id }
		});

		createAcc.afterClosed().subscribe(result => {
			console.log('The dialog was closed');

			if (result) {

				console.log(result)

			}

		});
	}

	//update staff information
	updateStaffInfo() {
		let tempStaff = this.selectedStaff
		delete tempStaff.clickActive;
		this.http.updateStaffInfo(tempStaff)
			.subscribe((response: any) => {
				if (response.response == "okay") {
					if (tempStaff._id == this.selectedStaff._id) this.selectedStaff.clickActive = true;
					this.editStaff = false;
				}
			})

	}

	//delete a staff information
	deleteStaffInfo(id) {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			maxWidth: '70vw',
			maxHeight: '20vh',
			width: '300px',
			height: "200px",
			data: { message: "delete this staff information?" }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				if (result.response) {
					this.http.deleteStaffInfo(id)
						.subscribe((response: any) => {
							if (response.response == "okay") {
								this.dialogRef.close({ type: "delete",id:id })
							}
						})
				}
			}

		});


	}

	disableStaffAccount(id) {

		this.http.disableStaffAccount({ userID: id })
			.subscribe((response: any) => {
				if (response.response == "okay") {
					this.selectedStaff.isDeactivated = true
				}
			})
	}

	enableStaffAccount(id) {

		this.http.enableStaffAccount({ userID: id })
			.subscribe((response: any) => {
				if (response.response == "okay") {
					this.selectedStaff.isDeactivated = false
				}
			})
	}

	showNewPassword(password): void {
		// const showPass = 
		this.dialog.open(NewStaffDialogComponent, {
			//   width: '250px',
			data: { dialogType: "showPass", password: password }
		});

		// showPass.afterClosed().subscribe(result => {});
	}

	resetStaffPassword(id) {
		this.http.resetStaffPassword({ userID: id })
			.subscribe((response: any) => {
				if (response.response == "okay") {
					this.showNewPassword(response.data.fetched.password)
				}
				// console.log(response)
			})

	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}

@Component({
	selector: 'app-new-staff-dialog',
	templateUrl: 'new-staff-dialog.component.html',
	styleUrls: [
		'new-staff-dialog.component.css'
	]
})
export class NewStaffDialogComponent {

	@ViewChild('addStaff') addStaff: NgForm;
	@ViewChild('createStaffAccountForm') createStaffAccountForm: NgForm;

	// this.form.controls['email'].setErrors({'incorrect':true})




	dialogType: string; //type of dialog

	staffName: string;
	staffID: string;


	public newAccountUsername = {
		username: "",
		permissions: {
			staff: false,
			menu: false,
			accounts: false,
			orders: false,
			delivery: false
		},
		_id: ""
	}; //new username for account to be created for a stafff

	newAccountPassword: string;
	resetPass: string;

	usernameError: string;
	public isCheckingUsername = false;//triggers the loading gif when checking if a username exists in the backend

	constructor(public dialogRef: MatDialogRef<NewStaffDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
		public http: StaffOperationsService, public accountHttp: AppBackendOperationsService,
		private photoUpload: GeneralPhotoUploadService, private validator: CustomValidatorsService,
		private serverDomain: ServerDomainService, private notify: PushNotificationService,
	) {

		this.dialogType = data.dialogType
		if (data.dialogType == "createAcc") {
			this.staffName = data.staffName;
			this.staffID = data.staffID;
		}
		if (data.dialogType == "showPass") {
			this.resetPass = data.password
		}

	}





	//check if username exists when creating an account for a staff
	checkUsername() {
		this.isCheckingUsername = true;
		//make http call to server checking whether username exists or not
		this.accountHttp.checkEmailExistence(this.newAccountUsername.username.trim().toLowerCase())
			.subscribe((response: any) => {

				this.isCheckingUsername = false;

				if (response.response == "okay") {
					//check the exists property
					if (response.data.fetched.exists) {
						this.usernameError = "username already exists"
						this.createStaffAccountForm.controls['username'].setErrors({ 'incorrect': true })
						// console.log("Username exists")
					} else {
						// console.log('username doest not exist')
						//nothing for now
					}
				}
			});

	}

	createStaffAccount() {
		console.log(this.newAccountUsername)
		this.newAccountUsername._id = this.staffID
		this.http.createStaffAccount(this.newAccountUsername)
			.subscribe((response: any) => {
				if (response.response == "okay") {
					this.newAccountPassword = response.data.fetched.password;
					this.dialogType = "newAccInfo"
				}
			})
	}


	onNoClick(): void {
		this.dialogRef.close();
	}
}


@Component({
	selector: 'app-staff',
	templateUrl: './staff.component.html',
	styleUrls: [
		'./staff.component.css'
	]
})

export class StaffComponent implements OnInit {
	@ViewChild('updateStaff') updateStaff: NgForm;



	public isStaffSelected: boolean = false;

	logoAssestDir = "";
	uploading = false;
	acceptedImageTypes;
	progress;

	public allStaffInfo = []; //staff information



	editStaff = false; //show or hide staff edit form

	constructor(
		private route: ActivatedRoute, private notify: PushNotificationService, private http: StaffOperationsService,
		private accountHttp: AppBackendOperationsService, public dialog: MatDialog,
		private photoUpload: GeneralPhotoUploadService, private validator: CustomValidatorsService,
		private serverDomain: ServerDomainService

	) {
		this.acceptedImageTypes = this.validator.acceptedImageFileTypes();
		this.logoAssestDir = this.serverDomain.getImgAssetsUrlDir();
	}

	openNewStaffDialog(): void {
		const dialogRef = this.dialog.open(StaffDialogComponent, {
			panelClass:"custom-dialog",
			data: { dialogType: "newStaff" }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				//update staff list
				this.allStaffInfo.push(result);
			}

		});
	}
	//show staff details when a staff is selected from a list of staff
	showStaffDetails(staffID) {

		const dialogRef = this.dialog.open(StaffDialogComponent, {
			panelClass:"custom-dialog",
			data: { dialogType: "staffDetail", id: staffID }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				if (result.type == "delete") {
					this.allStaffInfo.forEach((doc, index) => {
						if (result.id == doc._id) this.allStaffInfo.splice(index, 1)
					})
				}
			}

		});
	}



	ngOnInit() {

		this.http.getAllStaffInfo()
			.subscribe((response: any) => {
				// console.log(response.data.fetched)

				if (response.data.fetched.length != 0) {
					response.data.fetched.forEach((doc, index) => {
						doc["clickActive"] = (index == 0) ? true : false;
					});
					//get all staff info
					this.allStaffInfo = response.data.fetched;
					//assign first staff as the currently selected staff
					// this.selectedStaff = this.allStaffInfo[0];
				}
			})

	}

}
