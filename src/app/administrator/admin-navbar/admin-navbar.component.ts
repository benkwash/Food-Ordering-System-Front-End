import { Component, OnInit,Output,EventEmitter } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {AppProductInformationService} from "../../services/other/app-product-information.service";

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: [
	  '../../../app-styles/generic-portal-navbar.component.css',
		'./admin-navbar.component.css'
	]
})
export class AdminNavbarComponent implements OnInit {

	@Output() toggleSideBar:EventEmitter<any>=new EventEmitter;


	//product info
	public productName:string;
	public productTestingPhase:string;

	constructor(private route:ActivatedRoute,private productInfo:AppProductInformationService) {
		this.productName = this.productInfo.getProductName();
		this.productTestingPhase = this.productInfo.getProductTestingStage();
	}

	sidebarToggle(){
		this.toggleSideBar.emit();
	}

	ngOnInit() {
		let params:any =  this.route.snapshot.params;
		// this.schoolUrl = params.schoolUrl ? params.schoolUrl:"";
	}

	
}
