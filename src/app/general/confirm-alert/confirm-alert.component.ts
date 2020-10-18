import { Component, OnInit,ViewChild,Input,Output,EventEmitter,OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {Observable,Subscription,of} from "rxjs";

@Component({
	selector: 'app-confirm-alert',
	templateUrl: './confirm-alert.component.html',
	styleUrls: ['./confirm-alert.component.css']
})
export class ConfirmAlertComponent implements OnInit,OnDestroy {
	@Input('modalContent') modalContent:string;
	@Input('modalConfirm') modalConfirm:string;

	@Output() onConfirmed = new EventEmitter<boolean>();
	modalRef: BsModalRef;
	@ViewChild('modalTemplate') template;

	//by default use as a confirm box
	public useAsAlertBox:boolean =false;

	private config = {backdrop: true, ignoreBackdropClick:true, keyboard:false};
	private customDialogBoxFnCalled:boolean = false;
	private confirmDialogResult:boolean = false;
	private tempSubscription:Subscription;
	constructor(private modalService: BsModalService) {}

	ngOnInit() {}

	//show modal
	showModal(){
		this.customDialogBoxFnCalled = false;

		//noinspection TypeScriptValidateTypes
		this.modalRef = this.modalService.show(this.template, this.config);
	}

	//a custom confirm dialog box which returns an observable
	//use to replace the default javascript browser confirm box
	public customConfirmDialogBox(mainMessage:string="",confirmMsg:string="",options:any=null):Observable<boolean>
	{
		this.modalContent = mainMessage;
		this.modalConfirm = confirmMsg;

		this.customDialogBoxFnCalled = true;

		//open modal dialog
		//if options exist, override the config with the options
		let config = this.config;

		//if using as a dialogue or alert box instead of a confirmation box
		if(options && options.useAsAlertBox) {
			//use as an alert box
			this.useAsAlertBox = true;
		}

		//ExpressionChangedAfterItHasBeenCheckedError when confirm alert is called right
		//after components haven been changed.
		let that = this;
		setTimeout(function(){
			//noinspection TypeScriptValidateTypes
			that.modalRef = that.modalService.show(that.template,config);
		},10);

		//return an observable
		return Observable.create((observer)=>
		{
			//send observable stream after modal closing and css transitions have taken place
			//onHide and onHidden triggering more than one observable
			//force to trigger only once when called
			that.tempSubscription = that.modalService.onHidden.subscribe((reason)=>
			{
				//return a boolean instead
				observer.next(that.confirmDialogResult);

				//reset the alert box use case
				that.useAsAlertBox = false;

				//subscribe only once. other modals being closed can also be triggered here
				//since the modal service subscribed to is a global one.
				if(that.tempSubscription)
					that.tempSubscription.unsubscribe();
			});
		});
	}

	//hide modal
	public hideModal(){
		this.modalRef.hide();
	}

	//confirm was clicked
	public confirm(){
		//close modal
		this.modalRef.hide();

		//for confirm dialog box fn
		this.confirmDialogResult = true;

		//only emit if custom dialog box is not called
		if(!this.customDialogBoxFnCalled) {
			this.onConfirmed.emit(true); //emit event
		}
	}

	//confirm was declined
	public decline(){
		//close modal
		this.modalRef.hide();

		//for confirm dialog box fn
		this.confirmDialogResult = false;

		//only emit if custom dialog box is not called
		if(!this.customDialogBoxFnCalled){
			this.onConfirmed.emit(false);
		}
	}

	ngOnDestroy (){
		if(this.tempSubscription)
			this.tempSubscription.unsubscribe();
	}
}//end
