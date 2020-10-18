import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-success-alert',
  templateUrl: './success-alert.component.html',
  styleUrls: ['../../../app-styles/general/all-alert.component.css']
})
export class SuccessAlertComponent implements OnInit {
  	@Input() message:string;
  	@Output() onSuccessClosed = new EventEmitter<boolean>();
  	public alertTimeout:number = 10000;
	constructor() { }

  	ngOnInit() {
  	}

  	//closing success alert should reset the isSuccessful Property
  	onClosed(){
    	//emit event
    	this.onSuccessClosed.emit(true);
  	}
}
