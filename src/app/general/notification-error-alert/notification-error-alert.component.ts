import { Component, OnInit,Input,EventEmitter,Output } from '@angular/core';

@Component({
  selector: 'app-notification-error-alert',
  templateUrl: './notification-error-alert.component.html',
  styleUrls: ['../../../app-styles/general/all-alert.component.css']
})
export class NotificationErrorAlertComponent implements OnInit {
	@Input() errorMsg:string;
	@Input() tryAgain:boolean;
	@Output() onErrorClosed = new EventEmitter<boolean>();
	@Output() onTryAgain = new EventEmitter<boolean>();

	constructor() { }

	ngOnInit() {
	}

	//closing success alert should reset the isSuccessful Property
	onClosed(){
		//emit event
		this.onErrorClosed.emit(true);
	}

	tryOperationsAgain() {
		this.onTryAgain.emit(true);
	}
}
