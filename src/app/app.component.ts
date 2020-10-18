import { Component,OnInit, OnDestroy , ViewChild } from '@angular/core';
import { Subscription }   from 'rxjs';
import { SwUpdate } from '@angular/service-worker';

import {PushNotificationService} from "./services/other/push-notifications.service";
import {ConfirmAlertComponent} from "./general/confirm-alert/confirm-alert.component";
import {PasswordSetRetrievalComponent} from "./general/password-set-retrieval/password-set-retrieval.component";
import {RouterUrlTrackingService} from "./services/other/router-url-tracking.service";
import {GlobalSetTitleService} from "./services/other/global-set-title.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy {
	public hasErrorMsg:boolean = false;
	public hasSuccessMsg:boolean = false;
	public hasOtherMsg:boolean = false;

	public errorMessage:string = "";
	public successMessage:string = "";
	public otherMessage:string = "";

	public retryRequest:boolean = false;

	public errSubscription: Subscription;
	public successSubscription: Subscription;
	public otherSubscription: Subscription;
	public otherClosedSubscription: Subscription;
	public customConfirmDialogSubscription: Subscription;
	public passwordRetrieveRequestSubscription:Subscription;
	public swUpdateSubscription:Subscription;
	public swUpdateConfirmSubscription:Subscription;
	public allSubscription:Subscription = new Subscription();

	//confirm alert component
	@ViewChild(ConfirmAlertComponent) private confirmAlert: ConfirmAlertComponent;
	@ViewChild(PasswordSetRetrievalComponent) private passwordRetrieveComp:PasswordSetRetrievalComponent;
	
	//route track needed for tracking previous and current route for all routes.
	//globalTitleSet needed for setting all component titles
	constructor(private notification:PushNotificationService,
					private routerTracking:RouterUrlTrackingService,
					private globalTitleSet:GlobalSetTitleService,
					private swUpdate: SwUpdate)
	{
		//subscribe to error notification
		this.errSubscription = this.notification.getErrorNotification()
			.subscribe(message=> {
				//only show error once (and show again if previous alert is closed
				if(!this.hasErrorMsg){
					this.hasErrorMsg = true;
					this.errorMessage = message;
				}
			});

		//subscribe to success notification
		this.successSubscription = this.notification.getSuccessNotification()
			.subscribe(message=> {
				this.hasSuccessMsg = true;
				this.successMessage = message;
			});

		//subscribe to other notification
		this.otherSubscription = this.notification.getOtherNotification()
			.subscribe(message=> {
					this.hasOtherMsg = true;
					this.otherMessage = message;
			});

		//subscribe to closing other notification
		this.otherClosedSubscription = this.notification.getClosedOtherNotification()
			.subscribe(message=> {
				this.onOtherAlertClosed(true);
			});

		//SUBSCRIBE TO AVAILALBLE UPDATE (AFTER DOWNLOAD)
		this.swUpdateSubscription = this.swUpdate.available.subscribe((event)=>{
			// Browser downloaded a new service worker.
			const mainMsg = "A new version of this site is available. Load New Version?";
			const confirmMsg = "";
			this.swUpdateConfirmSubscription = this.confirmAlert.customConfirmDialogBox(mainMsg,confirmMsg)
				.subscribe((confirm)=> {
					if(confirm){
						window.location.reload();
					}
				});
		});

		//SUBSCRIBE TO CONFIRM ALERT DIALOGUE FOR DEACTIVATING ROUTE
		this.customConfirmDialogSubscription = this.notification.getCustomConfirmDialogueReq()
			.subscribe((info:{messageInfo:string|string[],options:any})=>
			{
				const messageInfo = info.messageInfo;
				const options = info.options;

				//message could be a string or an array of strings
				//if message is an array, only retrieve the first two for the confirmation dialogue
				//main message and confirmation message
				let mainMsg = "", confirmMsg = "";

				//set main message
				if(Array.isArray(messageInfo) && messageInfo.length > 0){
					mainMsg = messageInfo[0]; 
				}else if(typeof messageInfo === "string"){
					mainMsg = messageInfo
				}

				//set confirmation message
				if(Array.isArray(messageInfo) && messageInfo.length >= 2){
					confirmMsg = messageInfo[1];
				}
				
				//open confirm alert dialogue box with messages
				this.confirmAlert.customConfirmDialogBox(mainMsg,confirmMsg,options)
					.subscribe((confirm:boolean)=>{
						//set dialogue box response
						this.notification.setCustomConfirmDialogueResponse(confirm);
					});
			});

		//GET USER PASSWORD RETRIEVE COMPONENT
		this.passwordRetrieveRequestSubscription = this.notification.getPasswordComponentRequest()
			.subscribe((request:boolean)=>{
				this.passwordRetrieveComp.getSavedPassword()
					.subscribe((response:string)=>{
						//send response notification
						this.notification.setPasswordComponentResponse(response);
					});
			});

		//push all subscription
		this.allSubscription.add(this.errSubscription);
		this.allSubscription.add(this.successSubscription);
		this.allSubscription.add(this.otherSubscription);
		this.allSubscription.add(this.otherClosedSubscription);
		this.allSubscription.add(this.customConfirmDialogSubscription);
		this.allSubscription.add(this.passwordRetrieveRequestSubscription);
		this.allSubscription.add(this.swUpdateSubscription);
		this.allSubscription.add(this.swUpdateConfirmSubscription);
	}

	ngOnInit() {
		console.warn(".%c" + 'Do not use this console, unless of course you know what you are doing', "color:" + '#c9847f' + ";font-size:20px;")
	}

	//retry request
	public onErrorTryAgain(event):void {
		if(event){
			this.hasErrorMsg = false;
			//if retry request, retry request
		}
	}

	//hide error alert
	public onErrorAlertClosed(event):void{
		if(event){
			this.hasErrorMsg = false;
			this.errorMessage = "";
		}
	}

	//on close of success alert
	public onSuccessAlertClosed(res:boolean):void{
		if(res){
			this.hasSuccessMsg = false;
			this.successMessage = "";
		}
	}

	//on close of other alert
	public onOtherAlertClosed(res:boolean):void{
		if(res){
			this.hasOtherMsg = false;
			this.otherMessage = "";
		}
	}

	ngOnDestroy() {
		// prevent memory leak when component destroyed
		this.allSubscription.unsubscribe();
		// this.errSubscription.unsubscribe();
		// this.successSubscription.unsubscribe();
		// this.otherSubscription.unsubscribe();
		// this.otherClosedSubscription.unsubscribe();
		// this.customConfirmDialogSubscription.unsubscribe();
		// this.passwordRetrieveRequestSubscription.unsubscribe();
	}
}
