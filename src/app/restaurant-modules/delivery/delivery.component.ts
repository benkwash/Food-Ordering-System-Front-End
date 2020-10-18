import { Component, OnInit,ViewChild, Inject} from '@angular/core';
import {ActivatedRoute,Router,Data} from "@angular/router";
import {NgForm} from "@angular/forms";
import {Observable} from "rxjs";

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';


//services
import {PushNotificationService} from "../../services/other/push-notifications.service";
import {DeliveryOperationsService} from '../services/http/delivery-operations.service';
import {AuthenticationService} from "../../services/other/authentication.service";


@Component({
	selector: 'app-delivery-dialog',
	templateUrl: 'delivery-dialog.component.html',
	styleUrls: [
		'./delivery-dialog.component.css'
   ]
  })
export class DeliveryDialogComponent {
	
	orderID="";
	dialogType="";
	customerName="";
	cartID="";
	customerContact="";
	customerAddress="";

	

	constructor(
	  public dialogRef: MatDialogRef<DeliveryDialogComponent>, public http:DeliveryOperationsService,private notify:PushNotificationService,
	  @Inject(MAT_DIALOG_DATA) public data: any, private authenticate:AuthenticationService
	  ) {
		this.dialogType=this.data.type;
		this.cartID=this.data.orderInfo._id;
		this.customerName=this.data.orderInfo.customerName;
		this.orderID=this.data.orderInfo.orderID;
		this.customerContact=this.data.orderInfo.deliveryLocation.number;
		this.customerAddress=this.data.orderInfo.deliveryLocation.address;
	}


	confirmDelivery(){
		this.http.updateDelivery({ _id:this.cartID,completed:{completed:true, time: new Date()},})
		.subscribe((response:any)=>{
			if(response.response=="okay"){
				if(response.data.fetched.success){
					this.notify.setSuccessNotification('you force waaa...successfully delivered')
					this.dialogRef.close(this.cartID)
				}else{
					this.notify.notifyError('chaley, yawa on our end eeh....try again')
				}
			}
		})
	}
	
	onNoClick(): void {
		this.dialogRef.close();
	}
}


@Component({
	selector: 'app-delivery',
	templateUrl: './delivery.component.html',
	styleUrls: [
		 './delivery.component.css'
	]
})

export class DeliveryComponent implements OnInit {

    @ViewChild('form') form:NgForm;
    


	public allDeliveries=[]
	public cartID;

	public accountType="";

	selectedFilter="";//active=orders not delivered,waiting=awaiting cinfirmation by customer,delivered=confirmed deliveries


    constructor(
		private route:ActivatedRoute, private notify:PushNotificationService,
		 private http:DeliveryOperationsService, public dialog: MatDialog,
		 private authenticate:AuthenticationService
	){
		this.accountType=this.authenticate.isAdmin()?"admin":"staff"
		this.selectedFilter="active"
	}
	
	confirmDelivery(index): void {
		let order=this.allDeliveries[index];
		const dialogRef = this.dialog.open(DeliveryDialogComponent, {
		  width: '350px',
		  height:'300px',
		  data: {type: "confirmDelivery",orderInfo:order}
		});
	
		dialogRef.afterClosed().subscribe(cartID => {
			if(cartID){
				this.removeDeliveryDoc(cartID)
			}
		});
	}

	removeDeliveryDoc(cartID){
		this.allDeliveries.forEach((doc,index)=>{
			if(doc._id==cartID)this.allDeliveries.splice(index,1)
		})
	}

	
	getDeliveryInfo(filter){
		this.http.getAllDeliveryInfo(filter)
		.subscribe((response:any)=>{
			// console.log(response)
			this.allDeliveries=response.data.fetched;
		})
	}

	ngOnInit(){

		
		this.getDeliveryInfo('active')

		// dummy data
		// this.allDeliveries=[
		// 	{orderID:123434,name:"bejhawe asjd", delivered:false,deliveryLocation:{address:"arue sdkgjnbo",number:34523458234}},
		// 	{orderID:145434,name:"srhjrth asjd", delivered:false,deliveryLocation:{address:"arue sdkgjnbo",number:34523458234}},
		// 	{orderID:124534,name:"bejhawe serije", delivered:false,deliveryLocation:{address:"arue sdkgjnbo",number:34523458234}},
		// 	{orderID:123434,name:"weo44ih asjd", delivered:false,deliveryLocation:{address:"arue sdkgjnbo",number:34523458234}},
		// 	{orderID:123434,name:"weieje weepei", delivered:false,deliveryLocation:{address:"arue sdkgjnbo",number:34523458234}},
		// 	{orderID:123434,name:"werijwjp asjd", delivered:false,deliveryLocation:{address:"arue sdkgjnbo",number:34523458234}},
		// 	{orderID:533434,name:"bejhawe we[roiwe", delivered:false,deliveryLocation:{address:"arue sdkgjnbo",number:34523458234}},
		// 	{orderID:123564,name:"weioeerewon asjd", delivered:false,deliveryLocation:{address:"arue sdkgjnbo",number:34523458234}},
		// 	{orderID:123434,name:"dgfiew werijwe	", delivered:false,deliveryLocation:{address:"arue sdkgjnbo",number:34523458234}}
		// ]
	}

}
