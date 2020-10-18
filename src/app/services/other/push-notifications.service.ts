import { Injectable } from '@angular/core';
import { Subject,Observable }    from 'rxjs';
@Injectable()
export class PushNotificationService {
  // Observable string sources
  	private error = new Subject<string>();
	private success = new Subject<string>();
	private other = new Subject<string>();
	private otherClosed = new Subject<string>();
	private request = new Subject<string>();

	//for confirm dialogue box
	//an string or an array of string
	private confirmDialogReq = new Subject<{messageInfo:string|string[],options:any}>();
	private confirmDialogResponse = new Subject<boolean>();

	//for password retrieval
	private openPasswordComponent = new Subject<boolean>();
	private passwordComponentResponse = new Subject<string>();

	// set error
	public notifyError(error: string) {
		this.error.next(error);
	}

	// set success notification message
	public setSuccessNotification(message: string) {
		this.success.next(message);
	}

	// set other notification message
	public setOtherNotification(message: string) {
		this.other.next(message);
	}

	//close other notification
	public closeOtherNotification() {
		this.otherClosed.next("");
	}

	//get error
	public getErrorNotification():Observable<string> {
		return this.error.asObservable();
	}

	//get success notification
	public getSuccessNotification():Observable<string> {
		return this.success.asObservable();
	}

	//get other notification
	public getOtherNotification():Observable<string> {
		return this.other.asObservable();
	}

	//close other notification
	public getClosedOtherNotification():Observable<string> {
		return this.otherClosed.asObservable();
	}

	// set request
	setLastRequest(req: string) {
		this.request.next(req);
	}

	//get request
	getLastRequest(req){
		return this.request;
	}

	//set a confirm dialogue request
	//only pass message to confirmAlert component in app component.
	public customConfirmDialogueBox(messageInfo:string|string[],options=null):Observable<boolean>{
		this.confirmDialogReq.next({messageInfo:messageInfo,options:options});

		//return response
		return this.confirmDialogResponse.asObservable();
	}

	//set confirm dialogue box response
	//call next handler after a timeout(async operation)
	public setCustomConfirmDialogueResponse(response:boolean):void {
		this.confirmDialogResponse.next(response);
	}
	
	//get confirm dialogue box request
	public getCustomConfirmDialogueReq():Observable<{messageInfo:string|string[],options:any}> {
		return this.confirmDialogReq.asObservable();
	}

	//open password retrieve component
	public retrieveUserPassword():Observable<string>{
		this.openPasswordComponent.next(true);

		return this.passwordComponentResponse.asObservable();
	}

	//get password retrieve component observable
	public getPasswordComponentRequest():Observable<boolean>{
		return this.openPasswordComponent.asObservable();
	}

	//set password retrieve component response
	//call next handler after a timeout(async operation)
	public setPasswordComponentResponse(response:string):void{
		this.passwordComponentResponse.next(response);
	}
}
