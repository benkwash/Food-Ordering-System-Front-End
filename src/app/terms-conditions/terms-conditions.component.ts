import { Component, OnInit,OnChanges,Input, Output,
   EventEmitter,ViewChild,SimpleChanges
} from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';

@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css']
})
export class TermsConditionsComponent implements OnInit,OnChanges {
  @Output() acceptStatus = new EventEmitter<boolean>();

  //enforce agreement(by either accepting or declining
  @Input() enforceAgreement:boolean = false; 
  
  @ViewChild('modalTemplate') modalTemplate;
  private modalRef: BsModalRef;

  //modal configuration
  private config = {
    //default config
    backdrop: true, ignoreBackdropClick:true, keyboard:false,
    //add custom class the modal with adjust to the width of the contents
    class:'width-fit-content'
  };

  constructor(private modalService: BsModalService) { }

  ngOnInit() {}

  ngOnChanges(changes:SimpleChanges) {
    let that = this;

    //causing after check error
    setTimeout(function () {
      that.openTermsAndConditions();
    },1);
  }

  public openTermsAndConditions(){
    //noinspection TypeScriptValidateTypes
    this.modalRef = this.modalService.show(this.modalTemplate, this.config);
  }
  
  public acceptTermsAndConditions(){
    this.acceptStatus.emit(true);

    //hide the modal
    this.modalRef.hide();
  }
  
  public declineTermsAndConditions(){
    this.acceptStatus.emit(false);

    //hide the modal
    this.modalRef.hide();
  }
}
