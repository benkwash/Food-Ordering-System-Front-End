import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AppProductInformationService} from "../../services/other/app-product-information.service";

import {AuthenticationService} from "../../services/other/authentication.service"
import { StaffOperationsService } from "../services/http/staffOperations.service"

@Component({
  selector: 'app-restaurant-staff-navbar',
  templateUrl: './restaurant-staff-navbar.component.html',
  styleUrls: [
	  '../../../app-styles/generic-portal-navbar.component.css',
		'./restaurant-staff-navbar.component.css'
	]
})
export class RestaurantStaffNavbarComponent implements OnInit {

	@Output() toggleSideBar:EventEmitter<any>=new EventEmitter;

	public isCollapsed = true;
	public outsideClickCountAfterCollapse = 0;

	//product info
	public productName:string;
	public productTestingPhase:string;

    staffName="";

    permissions={

        menu:false,
        staff:false,
        orders:false,
        delivery:false,
        accounts:false,
        rating:false
	}
	
	
	constructor(private route:ActivatedRoute,private productInfo:AppProductInformationService, 
		private auth:AuthenticationService, private http:StaffOperationsService) {
		this.productName = this.productInfo.getProductName();
		this.productTestingPhase = this.productInfo.getProductTestingStage();
		this.permissions=JSON.parse(this.auth.getStaffPermissionsStorage());
	}

	sidebarToggle(){
		this.toggleSideBar.emit();
	}

	ngOnInit() {
		let params:any =  this.route.snapshot.params;
		this.getStaffInfo()
	}

	getStaffInfo(){
        this.http.getStaffInfo()
        .subscribe((response:any)=>{
            let staff=response.data.fetched
            this.staffName=staff.fName;
        })
    }
}
