import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { NgForm } from "@angular/forms";

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';



//services
import { CustomValidatorsService } from "../../services/other/custom-validators.service";
import { PushNotificationService } from "../../services/other/push-notifications.service";
import { ServerDomainService } from "../../services/http/server-domain.service";
import { GeneralPhotoUploadService } from "../../services/other/general-photo-upload.service";
import { MenuOperationsService } from '../services/http/menu-operations.service'

//confirmation dialog
import { ConfirmDialogComponent } from "../../general/confirm-dialog/confirm-dialog.component"


@Component({
	selector: 'app-add-menu-dialog',
	templateUrl: 'add-menu-dialog.component.html',
	styleUrls: [
		'./add-menu-dialog.component.css'
	],
})
export class AddMenuDialogComponent {
	menuForm = {
		name: "",
		description: "",
		ingredients: [],
		price: "",
		picture: "",
		options: [] //some menu come with selectable different options...eg kfc streetwise comes with coke,fanta,sprite etc
	};
	newIngredient = {
		name: "",
		canBeIncreased: false,
		maximum: 1,
		pricePerIncrement: 0
	}
	newOption = {
		name: "",
		price: 0
	}

	selectdMenu: any={
		ingredients:[],
		options:[]
	};

	editMenu = false;
	menuID = ""

	logoAssestDir = "";
	uploading = false;
	acceptedImageTypes;
	progress;


	dialogType = "";
	constructor(
		public dialog: MatDialog,
		public dialogRef: MatDialogRef<AddMenuDialogComponent>, public http: MenuOperationsService,
		private photoUpload: GeneralPhotoUploadService, private validator: CustomValidatorsService,
		private serverDomain: ServerDomainService, private notify: PushNotificationService,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.acceptedImageTypes = this.validator.acceptedImageFileTypes();
		this.logoAssestDir = this.serverDomain.getImgAssetsUrlDir();

		this.dialogType = this.data.dialogType;

		if (this.dialogType == "menuInformation") {
			this.menuID = this.data.menuID
			this.getMenuInformation()
		}
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
							let photo = response.data.other.newPhoto;
							if (this.dialogType == "addMenu") this.menuForm.picture = photo;
							else if(this.dialogType == "menuInformation"){
								this.selectdMenu.picture=photo;
								this.menuForm=this.selectdMenu;
								this.updateMenu();
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

	getMenuInformation() {
		this.http.getMenuInfo(this.menuID)
			.subscribe((response: any) => {
				this.selectdMenu = response.data.fetched
			})
	}
	addIngredient() {
		this.menuForm.ingredients.push(this.newIngredient);
		this.newIngredient = {
			name: "",
			canBeIncreased: false,
			maximum: 1,
			pricePerIncrement: 0
		}
	}

	addOption() {
		this.menuForm.options.push({ name: this.newOption.name, price: this.newOption.price });
		this.newOption = {
			name: "",
			price: 0
		}
	}
	removeIngredient(index) {
		this.menuForm.ingredients.splice(index, 1)
	}

	removeOption(index) {
		this.menuForm.options.splice(index, 1)
	}

	addMenu() {
		//    this.submitClicked.emit(data);
		console.log(this.menuForm)
		this.http.saveNewMenu(this.menuForm)
			.subscribe((response: any) => {
				// console.log(response.data.fetched);
				if (response.response == "okay") {
					this.dialogRef.close(response.data.fetched);
				}
			})

	}

	updateMenu() {
		this.http.updateMenu(this.menuForm)
			.subscribe((response: any) => {
				// console.log(response)
				this.editMenu = false;
				this.menuForm = {
					name: "",
					description: "",
					ingredients: [],
					price: "",
					picture: "",
					options: [] //some menu come with selectable different options...eg kfc streetwise comes with coke,fanta,sprite etc

				}
			})

	}

	cancelUpdate() {
		this.menuForm = {
			name: "",
			description: "",
			ingredients: [],
			price: "",
			picture: "",
			options: [] //some menu come with selectable different options...eg kfc streetwise comes with coke,fanta,sprite etc

		}
		this.editMenu = false;
	}

	deleteMenu() {
		//open confirmation dialog
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
			//   width: '250px',
			data: { message: "Delete this menu?" }
		});

		//get response
		dialogRef.afterClosed().subscribe(result => {
			if (result && result.response) {
				//if true go ahead and delete menu
				this.http.deleteMenu({ _id: this.menuID })
					.subscribe((response: any) => {
						this.dialogRef.close({ type: "delete", id: this.menuID })
					})
			}
		});
	}
	onNoClick(): void {
		this.dialogRef.close();
	}
}


@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: [
		'./menu.component.css'
	],
})

export class MenuComponent implements OnInit {


	@ViewChild('addmenu') addmenu: NgForm;
	@ViewChild('updatemenu') updatemenu: NgForm;



	public allMenu = [];

	public selectdMenu: any;

	public newIngredient = {
		name: "",
		canBeIncreased: false,
		maximum: "",
		pricePerIncrement: ""
	}
	public newOption = {
		name: "",
		price: ""
	}

	editMenu = false; //used to display/hide menu info and update html


	logoAssestDir = "";
	uploading = false;
	acceptedImageTypes;
	progress;

	constructor(
		private route: ActivatedRoute, private notify: PushNotificationService, private http: MenuOperationsService,
		public dialog: MatDialog, private photoUpload: GeneralPhotoUploadService, private validator: CustomValidatorsService,
		private serverDomain: ServerDomainService
	) {
		this.acceptedImageTypes = this.validator.acceptedImageFileTypes();
		this.logoAssestDir = this.serverDomain.getImgAssetsUrlDir();
	}


	addMenu(): void {
		const dialogRef = this.dialog.open(AddMenuDialogComponent, {
			panelClass:"custom-dialog",
			data: { dialogType: "addMenu" }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				// console.log('The dialog was closed');
				// console.log(result)
				this.selectdMenu = (this.allMenu.length == 0) ? result : this.selectdMenu;
				this.allMenu.push(result)
			}

		});
	}

	showSelectedMenu(id) {

		const dialogRef = this.dialog.open(AddMenuDialogComponent, {
			panelClass:"custom-dialog",
			data: { dialogType: "menuInformation", menuID: id }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				if (result.type == "delete")
					this.allMenu.forEach((doc, index) => {
						if (doc._id == result.id) this.allMenu.splice(index, 1)
					})
			}

		});
	}

	deleteMenu() {
		console.log(this.selectdMenu._id);
		this.http.deleteMenu({ _id: this.selectdMenu._id })
			.subscribe((response: any) => {
				// console.log(response)
			})
	}

	ngOnInit() {
		//get all menu
		this.http.getAllMenu()
			.subscribe((response: any) => {
				if (response.data.fetched.length != 0) {
					response.data.fetched.forEach((doc, index) => {
						doc["clickActive"] = (index == 0) ? true : false;
					});
					this.allMenu = response.data.fetched;
				}
				// console.log(response.data.fetched)
			})


	}

}