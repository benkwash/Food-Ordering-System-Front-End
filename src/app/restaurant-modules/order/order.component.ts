import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router, Data } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Observable } from "rxjs";

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatTable} from '@angular/material/table';


//services
import { CustomValidatorsService } from "../../services/other/custom-validators.service";
import { PushNotificationService } from "../../services/other/push-notifications.service";
import { ServerDomainService } from "../../services/http/server-domain.service";
import { GeneralPhotoUploadService } from "../../services/other/general-photo-upload.service";
import { OrderOperationsService } from '../services/http/order-operations.service'
import { AuthenticationService } from "../../services/other/authentication.service"

@Component({
	selector: "app-order-detail-dialog",
	templateUrl: "order-detail-dialog.component.html",
	styleUrls: [
		"order-detail-dialog.component.css"
	]
})
export class OrderDetailDialogComponent {

	public orderDetail: any={};

	public allActiveOrders:any;
	public filterMode=null;

	returnOnClose={
		remove:false,
		processing:false,
	}

	constructor(
		public dialogRef: MatDialogRef<OrderDetailDialogComponent>, public http: OrderOperationsService, 
		private notify: PushNotificationService,@Inject(MAT_DIALOG_DATA) public data: any, 
		private authenticate: AuthenticationService,public dialog:MatDialog,
	) {
		this.getOrderDetail(this.data.id);
		this.filterMode=this.data.mode;
	}
	onNoClick(): void {
		this.dialogRef.close();
	}

	getOrderDetail(id){
		this.http.getOneOrderDetail(id)
		.subscribe((response:any)=>{
			if(response.response=="okay"){
				this.orderDetail=response.data.fetched;
			}
		})
	}
	cancelOrderDialog(): void {
		const dialogRef = this.dialog.open(OrderDialogComponent, {
			width: '350px',
			height: '300px',
			data: { type: "cancelOrder", cartID: this.orderDetail._id }
		});

		dialogRef.afterClosed().subscribe(cartID => {
				if (cartID) {
					this.returnOnClose.remove=true
					this.dialogRef.close(this.returnOnClose);
				}

		});
	}
	deliveryDialog(deliveryPersons): void {
		const dialogRef = this.dialog.open(OrderDialogComponent, {
			width: '350px',
			height: '300px',
			data: { type: "assignDelivery", deliveryPersons: deliveryPersons, cartID: this.orderDetail._id }
		});

		dialogRef.afterClosed().subscribe(cartID => {
			if (cartID) {
				this.returnOnClose.remove=true
				this.dialogRef.close(this.returnOnClose);
			}
		});
	}

	confirmReservation(): void {
		const dialogRef = this.dialog.open(OrderDialogComponent, {
			data: { type: "confirmReservation", cartID: this.orderDetail._id }
		});

		dialogRef.afterClosed().subscribe(cartID => {
			if (cartID) {
				this.returnOnClose.remove=true
				this.dialogRef.close(this.returnOnClose);
			}
		});
	}
	confirmPickup(): void {
		const dialogRef = this.dialog.open(OrderDialogComponent, {
			data: { type: "confirmPickup", cartID: this.orderDetail._id }
		});

		dialogRef.afterClosed().subscribe(cartID => {
			if (cartID) {
				this.returnOnClose.remove=true
				this.dialogRef.close(this.returnOnClose);
			}
		});
	}

	//if order is delivery...get all delivery staff
	getDeliveryStaff() {
		this.http.getDeliveryStaff()
			.subscribe((response: any) => {
				this.deliveryDialog(response.data.fetched)
			})

	}



	processOrder() {
		let orderID = this.orderDetail._id
		this.http.processOrder(orderID)
			.subscribe((response: any) => {
				// console.log(response)
				if (response.response == "okay") {
					if (response.data.fetched) {
						this.notify.setSuccessNotification('success!!, go prepare the order')
						this.returnOnClose.processing=true
						this.dialogRef.close(this.returnOnClose);
						
						if (this.orderDetail._id == orderID) this.orderDetail["processing"] = true;
					} else this.notify.notifyError("oh yawaa...couldn't process order. try again")
				}
			})

	}

	
}

@Component({
	selector: 'app-order-dialog',
	templateUrl: 'order-dialog.component.html',
	styleUrls: [
		'./order-dialog.component.css'
	]
})
export class OrderDialogComponent {

	cancelReason = "";
	cartID = "";
	dialogType = "";

	deliveryPersons = [];
	deliveryPerson = null;
	cDate = new Date();

	constructor(
		public dialogRef: MatDialogRef<OrderDialogComponent>, public http: OrderOperationsService, private notify: PushNotificationService,
		@Inject(MAT_DIALOG_DATA) public data: any, private authenticate: AuthenticationService
	) {
		this.dialogType = this.data.type;
		this.cartID = this.data.cartID;
		// if (this.dialogType == "cancelOrder") this.cartID = this.data.cartID;
		if (this.dialogType == "assignDelivery") {
			this.deliveryPersons = this.data.deliveryPersons;
			// this.cartID = this.data.cartID;
		}
		// if (this.dialogType == "confirmPickup" || this.dialogType == "confirmReservation") this.cartID = this.data.cartID;
	}


	cancelOrder() {

		let cancelReason = this.cancelReason
		let by = "restaurant";
		let cartID = this.cartID

		this.http.cancelOrder({ cartID: cartID, cancelledBy: by, cancelReason: cancelReason })
			.subscribe((response: any) => {
				if (response.response == "okay") {
					this.dialogRef.close(cartID);
				} else this.notify.notifyError("oh yawa...couldn't cancel this order. try again.")
			})
	}

	assignDelivery() {

		this.http.assignDeliveryStaff({ staffID: this.deliveryPerson.userID, cartID: this.cartID, accountType: "staff", deliverMyself: false })
			.subscribe((response: any) => {
				if (response.response == "okay") {
					if (response.data.fetched.success) {
						this.notify.setSuccessNotification("successfully assigned to " + this.deliveryPerson.fName);
						this.dialogRef.close(this.cartID);
					} else this.notify.notifyError("yawa paa this..couldn't assign to " + this.deliveryPerson.fName)
				}
			})
	}

	deliverMyself() {
		let accountType = "";
		if (this.authenticate.isAdmin()) {
			accountType = "admin"
		} else {
			accountType = "staff"
		}

		this.http.assignDeliveryStaff({ cartID: this.cartID, accountType: accountType, deliverMyself: true })
			.subscribe((response: any) => {
				if (response.response == "okay") {
					if (response.data.fetched.success) {
						this.notify.setSuccessNotification("successfully assigned to yourself...do wild go deliver it eeeh!!!");
						this.dialogRef.close(this.cartID);
					}
				}
			})

	}

	confirm() {
		let mode = ""
		if (this.dialogType == 'confirmPickup') mode = "pickup"
		if (this.dialogType == 'confirmReservation') mode = "reservation"
		// console.log('cart id' + this.cartID)
		this.http.updateOrderStatus({ cartID: this.cartID, completed: true, time: this.cDate })
			.subscribe((response: any) => {
				if (response.response == "okay") {
					if (response.data.fetched) {
						this.notify.setSuccessNotification("successfully confirmed " + mode);
						this.dialogRef.close(this.cartID);
					} else this.notify.notifyError("yawa paa this..couldn't confirm " + mode);
				}
			})
	}

	onNoClick(): void {
		this.dialogRef.close();
	}
}

export interface AllOrdersTable {
    _id:string
    orderID: string;
    Date: Date;
    type: string;
    total: number;
}

@Component({
	selector: 'app-order',
	templateUrl: './order.component.html',
	styleUrls: [
		'./order.component.css'
	]
})

export class OrderComponent implements OnInit {

	@ViewChild('form') form: NgForm;
	@ViewChild(MatTable) matTable: MatTable<any>;

	selectedFilter="active";

	public allActiveOrders: any = []
	allOrdersColumn:string[]=["orderID","Date","mode","total","status"]

	constructor(
		private route: ActivatedRoute, private notify: PushNotificationService, private http: OrderOperationsService,
		private authenticate: AuthenticationService, public dialog: MatDialog
	) {

	}


	clickedOrder(id) {
		const dialogRef = this.dialog.open(OrderDetailDialogComponent, {
			panelClass:"custom-dialog",
			data: { id: id,mode:this.selectedFilter }
		});

		dialogRef.afterClosed().subscribe((res:any) => {
			if (res) {
				if(res.processing){
					this.allActiveOrders.forEach((doc, index) => {
						if (doc._id == id) this.allActiveOrders[index]["processing"] = true;
					});
				}else if(res.remove){
					this.allActiveOrders.forEach((doc, index) => {
						if (doc._id == id) this.allActiveOrders.splice(index, 1);
					});
				}
				this.matTable.renderRows();//refresh mat table and remove spliced data

			}
		});
	}

	processOrderList(response: any) {
		if (response.response == "okay") {
			this.allActiveOrders = response.data.fetched;
		}
	}
	
	filterOrders(filterBy) {
		this.http.filterRestaurantOrders(filterBy)
			.subscribe((response: any) => {
				this.processOrderList(response);
			})
	}

	allOrders() {
		this.http.getRestaurantOrders()
			.subscribe((response: any) => {
				// console.log(response)
				this.processOrderList(response)
			})
	}

	ngOnInit() {

		this.filterOrders("active");
	}

}
