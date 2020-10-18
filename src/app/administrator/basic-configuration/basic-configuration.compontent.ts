import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, Data } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Observable } from "rxjs";

//services
import { AdminOperationsService } from "../services/http/admin-operations.service";
import { CustomValidatorsService } from "../../services/other/custom-validators.service";
import { PushNotificationService } from "../../services/other/push-notifications.service";
import { ServerDomainService } from "../../services/http/server-domain.service";
import { GeneralPhotoUploadService } from "../../services/other/general-photo-upload.service";
import { CanComponentDeactivate } from "../../services/other/can-deactivate-guard.service";
import { GhLocationsService } from "../../services/data/gh-locations.service";

@Component({
	selector: 'app-basic-configuration',
	templateUrl: './basic-configuration.component.html',
	styleUrls: [
		'./basic-configuration.component.css'
	]
})

export class BasicConfigurationComponent implements OnInit {

	@ViewChild('form') form: NgForm;


	// this.form.controls['email'].setErrors({'incorrect':true})


	public locations = [
		"Ashanti Region",
		"Bono Region",
		"Bono East Region",
		"Ahafo Region",
		"Central Region",
		"Eastern Region",
		"Greater Accra Region",
		"Nothern Region",
		"Savannah Region",
		"North East Region",
		"Upper East Region",
		"Upper West Region",
		"Volta Region",
		"Oti Region",
		"Western Region",
		"Western north Region"
	]
	public currentLocation = {
		city: "",
		deliveryCost: ""
	}
	public otherLocations = []
	public newCity = "";
	public newDeliveryCost = 0;

	public formState = {
		picture: "",
		region: "",
		cities: [],
		pickup: false,
		delivery: false,
		tableReservation: false,
		totalTables: null, //total number of reservable tables
		totalChairs: null, //total number of reservable chairs
		maximumChairPerTable: null,
		costPerTable: null //cost to reserve table

	}

	public isNewConfig: boolean;
	public editMode = false;//used to change the view from display mode to edit mode...///show iput fields
	public showTableOptions = false;//toggle to show options for reserving table
	public configOptions: any;

	isSubmitting = false;

	logoLink = "";
	logoAssestDir = "";
	uploading = false;
	progress;
	acceptedImageTypes;

	constructor(
		private http: AdminOperationsService, private route: ActivatedRoute, private notify: PushNotificationService,
		private photoUpload: GeneralPhotoUploadService, private serverDomain: ServerDomainService,
		private validator: CustomValidatorsService
	) {
		this.logoAssestDir = this.serverDomain.getImgAssetsUrlDir();
		this.acceptedImageTypes = this.validator.acceptedImageFileTypes();
	}


	addCity() {
		console.log('new d cost:' + this.newDeliveryCost)
		if (this.newCity != "" && this.newDeliveryCost != (0 || null)) {
			this.formState.cities.push({
				city: this.newCity,
				deliveryCost: this.newDeliveryCost
			})

			this.newCity = "";
			this.newDeliveryCost = 0;
		} else if (this.newCity == "") {
			this.form.controls['ncity'].setErrors({ 'incorrect': true })
		} else {
			this.form.controls['ndelivery'].setErrors({ 'incorrect': true })
		}

	};

	removeCity(index) {
		this.formState.cities.splice(index, 1);
	}

	validateReservationData() {
		// totalTables: null, //total number of reservable tables
		// totalChairs: null, //total number of reservable chairs
		// maximumChairPerTable: null,
		// costPerTable: null
		if (this.formState.tableReservation == false) {
			return true;
		} else {
			if (this.formState.totalTables != (0 || null) && this.formState.totalChairs != (0 || null) &&
				this.formState.maximumChairPerTable != (0 || null) && this.formState.costPerTable != (0 || null)) {
				return true;
			} else {
				this.form.controls['tablecost'].setErrors({ 'incorrect': true })
				return false
			}
		}

	}

	submitForm() {
		console.log(this.formState)
		//validate table reservation making sure all data is given if table reservation is activated
		if (this.validateReservationData()) {
			this.isSubmitting = true;
			this.formState.cities.unshift(this.currentLocation);

			this.http.updateRestaurantConfiguration(this.formState, this.isNewConfig)
				.subscribe((response: any) => {
					if (response.response == "okay") {
						this.notify.setSuccessNotification("Successfully Updated");
						this.formState.cities.shift();
						this.editMode =false;//hide edit form
						this.isSubmitting = false;
					}

				})
		}


	}

	ngOnInit() {
		//handle resolver data
		this.route.data.subscribe((data: Data) => {
			let response = data['configOptions'];

			console.log(response.data.fetched)
			if (response.data.fetched) {
				this.currentLocation = response.data.fetched.cities[0];//first city in the array is the current location of the restaurant
				this.formState = response.data.fetched;
				this.formState.cities.shift();//remove current location from cities array
				this.isNewConfig = false;
				this.formState.picture = response.data.fetched.picture ? response.data.fetched.picture : "";
			} else {
				this.isNewConfig = true;
				this.editMode = true;
			}

		});



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
							this.formState.picture = response.data.other.newPhoto;
							this.submitForm();
							let initialIsNew=this.isNewConfig
							this.isNewConfig = false;
							this.editMode = initialIsNew?true:false;
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

}
