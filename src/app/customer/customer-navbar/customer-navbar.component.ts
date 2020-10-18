import { Component, OnInit } from '@angular/core';
import {ActivatedRoute,Router} from "@angular/router";
import {AppProductInformationService} from "../../services/other/app-product-information.service";

//services
import {AuthenticationService} from '../../services/other/authentication.service';
import {CustomerUnsignedService} from '../services/http/customer-unsigned.service'

@Component({
  selector: 'app-customer-navbar',
  templateUrl: './customer-navbar.component.html',
  styleUrls: ['./customer-navbar.component.css','../../../app-styles/generic-portal-navbar.component.css']
})
export class CustomerNavbarComponent implements OnInit {
	public isCollapsed = true;

	//product info
	public productName:string;

	public showSignup=false;

	public customerName="";
	constructor(private route:ActivatedRoute,private productInfo:AppProductInformationService,
				 private router:Router, private auth:AuthenticationService, private http:CustomerUnsignedService) {
		this.productName = this.productInfo.getProductName();
	}

	ngOnInit() {
		if(this.auth.isAuthenticated()){
			this.http.getCustomerName()
			.subscribe((response:any)=>{
				// console.log(response)
				if(response.response=="okay"){
					if(response.data.fetched.success){
						this.customerName=response.data.fetched.name.fName
					}
				}
			})
		}
	}

	//on click of the collapse icon
	public onCollapseBtnClick(): void {
		this.isCollapsed = !this.isCollapsed;
	}

	// referrerUrl
	navSignUp(){
		// [routerLink]="['/signupcustomer']"
		this.router.navigate(['/signupcustomer',{referrerUrl:this.router.url}])

	}
	navSignIn(){
		// [routerLink]="['/signIn']
		this.router.navigate(['/signIn',{referrerUrl:this.router.url}])
	}

	
}
