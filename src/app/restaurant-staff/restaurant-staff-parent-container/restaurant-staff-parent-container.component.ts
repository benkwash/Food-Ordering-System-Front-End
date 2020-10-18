import { Component, OnInit, ChangeDetectorRef, OnDestroy, } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';


@Component({
  selector: 'app-restaurant-staff-parent-container',
  templateUrl: './restaurant-staff-parent-container.component.html',
  styleUrls: [
    './restaurant-staff-parent-container.component.scss'
  ]
})
export class RestaurantStaffParentContainerComponent implements OnInit {

  mobileQuery: MediaQueryList;

  sideBarOpened = true

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    if(this.mobileQuery.matches){
      this.sideBarOpened=false
    }
  }

  ngOnInit() {
  }

  sideBarToggle($event) {
    //if the sidebar is closed, open it
    if(!this.sideBarOpened)this.sideBarOpened=true;
    else{//if it is opened
      //if it is a mobile device, close it
      if(this.mobileQuery.matches)this.sideBarOpened=!this.sideBarOpened
      // else //do nothing
    }
  }

  ngOnDestroy() {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
}
