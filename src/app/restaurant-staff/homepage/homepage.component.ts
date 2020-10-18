import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Data} from "@angular/router";
import {Observable, Subject, Subscription} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';

import {CustomValidatorsService} from "../../services/other/custom-validators.service";

import { StaffOperationsService } from "../services/http/staffOperations.service"

//services
import {AuthenticationService} from "../../services/other/authentication.service"
import { ServerDomainService } from "../../services/http/server-domain.service";
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

	
  staffName: string = "";
  staffPicture: string = "";

  permissions={

    menu:false,
    staff:false,
    orders:false,
    delivery:false,
    accounts:false,
    rating:false
}

  logoAssestDir = "";
	constructor(private http: StaffOperationsService,private serverDomain: ServerDomainService,
      private auth:AuthenticationService) {

        this.logoAssestDir = this.serverDomain.getImgAssetsUrlDir();
        this.permissions=JSON.parse(this.auth.getStaffPermissionsStorage());
    }

	ngOnInit(){
    this.getStaffInfo()
  }

  getStaffInfo(){
    this.http.getStaffInfo()
    .subscribe((response:any)=>{
        let staff=response.data.fetched
        this.staffName=staff.fName+" "+staff.lName;
        this.staffPicture=staff.picture;
    })
}
    
}