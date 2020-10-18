import { Component, OnInit,Input,EventEmitter,Output } from '@angular/core';

@Component({
  selector: 'app-error-alert',
  templateUrl: './error-alert.component.html',
  styleUrls: ['../../../app-styles/general/all-alert.component.css']
})
export class ErrorAlertComponent implements OnInit {
  @Input() serverErrorMsg:string;
  @Input() secondaryMsg:string;
  @Output() onErrorClosed = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  //closing success alert should reset the isSuccessful Property
  onClosed(){
    //emit event
    this.onErrorClosed.emit(true);
  }

}
