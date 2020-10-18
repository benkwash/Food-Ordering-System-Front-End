import { Component, OnInit,Output,Input,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-status-alert',
  templateUrl: './status-alert.component.html',
  styleUrls: ['../../../app-styles/general/all-alert.component.css']
})
export class StatusAlertComponent implements OnInit {
  	@Input() message:string;
  	@Output() onStatusClosed = new EventEmitter<boolean>();
  	constructor() { }

  	ngOnInit() {
  	}

  	//closing success alert should reset the isSuccessful Property
  	public onClosed():void{
    	//emit event
    	this.onStatusClosed.emit(true);
  	}
}
