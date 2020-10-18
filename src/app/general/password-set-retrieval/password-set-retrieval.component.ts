import { Component, OnInit,ViewChild,OnDestroy } from '@angular/core';
import {Observable, Subscription, of,asyncScheduler} from "rxjs";

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {UserPasswordInfoService} from "../../services/other/user-password-info.service";

@Component({
	selector: 'app-password-set-retrieval',
	templateUrl: './password-set-retrieval.component.html',
	styleUrls: []
})
export class PasswordSetRetrievalComponent implements OnInit,OnDestroy {
	public modalRef: BsModalRef;
	@ViewChild('modalTemplate') template;

	private config = {backdrop: true, ignoreBackdropClick:true, keyboard:false};
	private tempSubscription:Subscription;

	public passwordInput:string;
	constructor(private modalService: BsModalService,private passwordService:UserPasswordInfoService) {}

	ngOnInit() {}

	//If retrieved password is empty, prompt user to enter password
	//Save the entered password locally return the password to the user
	public getSavedPassword():Observable<string>
	{
		//reset input password first
		this.passwordInput = "";

		//retrieve saved password
		const password = this.passwordService.getLocalPassword();

		if(password){
			//create in an async scheduler context
			return of(password,asyncScheduler);
		}
		else {
			//prompt user for password.
			//noinspection TypeScriptValidateTypes
			this.modalRef = this.modalService.show(this.template,this.config);

			//return typed user password
			return this.returnTypedUserPassword();
		}
	}

	//save password locally and close modal
	public passwordGetConfirm()
	{
		//password is available
		if(this.passwordInput) {
			this.passwordService.savePasswordLocally(this.passwordInput);

			//hide modal
			this.modalRef.hide();
		}
	}

	//return typed user password
	public returnTypedUserPassword():Observable<string>
	{
		let that = this;
		return Observable.create((observer)=>
		{
			//send observable stream after modal closing and css transitions have taken place
			//onHide and onHidden triggering more than one observable
			//force to trigger only once when called
			that.tempSubscription = that.modalService.onHidden.subscribe((reason)=>
			{
				//return a boolean instead
				observer.next(that.passwordInput);

				//subscribe only once. other modals being closed can also be triggered here
				//since the modal service subscribed to is a global one.
				if(that.tempSubscription)
					that.tempSubscription.unsubscribe();
			});
		});
	}

	//cancel the retrieval of password and emit an empty password
	public passwordGetDecline(){
		this.modalRef.hide();
	}

	//reset saved password
	public removeLocalPassword():void {
		this.passwordService.removeLocalPassword();
	}

	ngOnDestroy(){
		if(this.tempSubscription)
			this.tempSubscription.unsubscribe();
	}
}
