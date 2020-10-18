import { Component, OnInit,Input,ViewChild } from '@angular/core';

@Component({
  selector: 'app-error-popover',
  templateUrl: './error-popover.component.html',
  styleUrls: ['./error-popover.component.css']
})

export class ErrorPopoverComponent implements OnInit {
  @Input() popContent:string;
  @Input() placement:string;
  @Input() popTitle:string;
  @Input() outsideClick:boolean;
  @ViewChild('pop') popover;

  constructor() { }

  ngOnInit() {
  }

  //show popOver
  showPopOver(){
    this.popover.show();
  }

  //hide popover
  hidePopOver() {
    this.popover.hide();
  }
}
