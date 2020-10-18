import { Component, OnInit, ViewChild, Inject ,ChangeDetectorRef} from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from "@angular/forms";

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {MatTable} from '@angular/material/table';


//services
import { CustomValidatorsService } from "../../services/other/custom-validators.service";
import { AuthenticationService } from "../../services/other/authentication.service";
import { PushNotificationService } from "../../services/other/push-notifications.service";
import { CustomerUnsignedService } from '../services/http/customer-unsigned.service';
import { CustomerService } from '../services/http/customer.service'


@Component({
    selector: 'app-orders-dialog',
    templateUrl: 'orders-dialog.component.html',
    styleUrls: [
        './orders-dialog.component.css'
    ]
})
export class OrdersDialogComponent {

    orderID = "";
    dialogType = "";
    cartID = "";

    cancelReason = "";

    reviewRating = 0;
    reviewComment = null;

    constructor(
        public dialogRef: MatDialogRef<OrdersDialogComponent>, public http: CustomerService, private notify: PushNotificationService,
        @Inject(MAT_DIALOG_DATA) public data: any, private authenticate: AuthenticationService
    ) {
        this.dialogType = this.data.type;
        this.cartID = this.data.cartID;

    }


    rating(rate) {
        this.reviewRating = rate;
    }

    confirmDelivery() {
        let update = {
            _id: this.cartID,
            customerConfirmation: true,
            review: {
                rating: this.reviewRating,
                comment: this.reviewComment,
                date: new Date()
            }
        }
        this.http.updatecustomerorder(update)
            .subscribe((response: any) => {
                if (response.response == "okay") {
                    if (response.data.fetched) {
                        this.notify.setSuccessNotification("confirmed...chaleee, enjoy your meal")
                        this.dialogRef.close(this.cartID);
                    } else {
                        this.notify.notifyError("yawa ooo....couldn't confirm delivery..try again")
                    }
                }
            })
    }

    cancelDelivery() {
        let update = {
            _id: this.cartID,
            cancelled: {
                cancelled: true,
                by: "customer",
                reason: this.cancelReason
            }
        }
        this.http.updatecustomerorder(update)
            .subscribe((response: any) => {
                if (response.response == "okay") {
                    if (response.data.fetched) {
                        this.notify.setSuccessNotification("you be yawa ooo...order successfully cancelled")
                        this.dialogRef.close(this.cartID);
                    } else {
                        this.notify.notifyError("yawa ooo....couldn't cancel order..try again")
                    }
                }
            })
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}


@Component({
    selector: 'app-order-detail',
    templateUrl: 'order-detail.component.html',
    styleUrls: [
        './order-detail.component.css'
    ]
})
export class OrderDetailComponent implements OnInit{

    public orderDetail: any={};
    orderReview:any={}

    reviewReply=null;

    constructor(public dialogRef: MatDialogRef<OrderDetailComponent>, public http: CustomerService, 
        private notify: PushNotificationService,@Inject(MAT_DIALOG_DATA) public data: any, 
        private authenticate: AuthenticationService, public dialog: MatDialog
        ){
            this.orderDetail=data.order
            this.orderReview=data.order.review;
    }

    //reply to review comments/replies from restaurants
    sendReply(){
        let thisDate=new Date();
        this.http.sendReply({
            _id:this.orderDetail._id,
            reply:this.reviewReply,
            date:thisDate
        })
        .subscribe((response:any)=>{
            if(response.response=="okay"){
                if(response.data.fetched){
                    this.orderDetail.review.replies.push({
                        by:this.orderDetail.customerID,
                        reply:this.reviewReply,
                        date:thisDate
                    })
                }
                this.reviewReply=null
            }
        })
    }


    confirmOrder(object): void {
        let order = object;
        const dialogRef = this.dialog.open(OrdersDialogComponent, {
            //   width: '350px',
            //   height:'80px',
            data: { type: "confirmDelivery", cartID: order._id }
        });

        dialogRef.afterClosed().subscribe(cartID => {
            if (cartID) this.dialogRef.close(cartID);
        });
    }


    cancelOrder(object): void {
        let order = object;
        const dialogRef = this.dialog.open(OrdersDialogComponent, {
            width: '350px',
            // height: '300px',
            data: { type: "cancelOrder", cartID: order._id }
        });

        dialogRef.afterClosed().subscribe(cartID => {
            if (cartID) this.dialogRef.close(cartID);
        });
    }

    ngOnInit(){

    }
    onNoClick(): void {
		this.dialogRef.close();
	}
}

export interface AllOrdersTable {
    _id:string
    orderID: string;
    Date: Date;
    mode: string;
    total: number;
    status:string;

}

@Component({
    selector: 'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
    @ViewChild(MatTable) matTable: MatTable<any>;


    public selectedFilter = ""

    public allOrders:AllOrdersTable[]
    // public allOrders;
    // dataSource = new MatTableDataSource(this.allOrders);

    myOrdersAll:AllOrdersTable[];
    allOrdersColumn:string[]=["orderID","Date","mode","total","status","action"]

    constructor(
        private http: CustomerService,
        private router: Router, private route: ActivatedRoute, public dialog: MatDialog,
        private notify: PushNotificationService, private changeDetectorRefs: ChangeDetectorRef
    ) {
        this.selectedFilter = "active";
    }

    showOrderDetails(order) {
		const dialogRef = this.dialog.open(OrderDetailComponent, {
			panelClass:"custom-dialog",
			data: { order: order }
		});

		dialogRef.afterClosed().subscribe(res => {
			if (res) {
				this.removeOrder(res);
			}
		});
    }
    
    getOrderDetails(object){

        this.http.getOneOrderDetail(object._id)
        .subscribe((response:any)=>{
            if(response.response=="okay"){
                response.data.fetched['status']=object.status;
                response.data.fetched['action']=object.action;
                this.showOrderDetails(response.data.fetched);
            }
        })
    }


    removeOrder(cartID): void {
        this.allOrders.forEach((doc, index) => {
            if (doc._id == cartID) this.allOrders.splice(index, 1)
        })
        this.matTable.renderRows();//refresh mat table and remove spliced data
    }
    confirmOrder(object): void {
        let order = object;
        const dialogRef = this.dialog.open(OrdersDialogComponent, {
            //   width: '350px',
            //   height:'80px',
            data: { type: "confirmDelivery", cartID: order._id }
        });

        dialogRef.afterClosed().subscribe(cartID => {
            if (cartID) this.removeOrder(cartID)
        });
    }


    cancelOrder(object): void {
        let order = object;
        const dialogRef = this.dialog.open(OrdersDialogComponent, {
            width: '350px',
            // height: '300px',
            data: { type: "cancelOrder", cartID: order._id }
        });

        dialogRef.afterClosed().subscribe(cartID => {
            if (cartID) this.removeOrder(cartID)
        });
    }


    filterColumns(){
        // allOrdersColumn:string[]=["orderID","Date","mode","total","status","action"]
        if(this.selectedFilter=="active"){
            this.allOrdersColumn[5]="action"
        }else{
            let pos=this.allOrdersColumn.indexOf("action");
            if(pos==5){
                this.allOrdersColumn.splice(pos,1);
            }
        }
    }
    
    getOrders(filter) {
        this.http.getMyOrders(filter)
            .subscribe((response: any) => {
                if (response.response == "okay") {
                    this.allOrders = response.data.fetched;
                    this.filterColumns();
                }
                // console.log(this.allOrders)
            })
    }


    ngOnInit() {
        let params = this.route.snapshot.params;

        this.getOrders("active")
    }

}