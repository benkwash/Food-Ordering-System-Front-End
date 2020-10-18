import { Component, OnInit } from '@angular/core';
import { AppProductInformationService } from "../../services/other/app-product-information.service";
import { MatDialog } from '@angular/material/dialog';
import { SignupPopupComponent } from '../signup-popup/signup-popup.component';
import { Router } from '@angular/router';

///services
import {AuthenticationService} from '../../services/other/authentication.service';
import {CustomerUnsignedService} from '../../customer/services/http/customer-unsigned.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: [ '../../../app-styles/generic-portal-navbar.component.css',"./navbar.component.css"]
})
export class NavbarComponent implements OnInit {

  //product info
  public productName: string;

  customerName:string="";
  constructor(
    private productInfo: AppProductInformationService,
     public dialog: MatDialog,  private router:Router,
     private auth:AuthenticationService,private http:CustomerUnsignedService
     ) {
    this.productName = this.productInfo.getProductName();
    this.checkStatus();

  }

  ngOnInit() {
  }

  checkStatus(){
    if(this.auth.isAuthenticated() && this.auth.isCustomer()){
			this.http.getCustomerName()
			.subscribe((response:any)=>{
				if(response.response=="okay"){
					if(response.data.fetched.success){
						this.customerName=response.data.fetched.name.fName
					}
				}
			})
		}
  }
  
  onLinkClick(link){
    this.router.navigate(['/'+link]);
}

  triggerSignup(): void {
    const dialogRef = this.dialog.open(SignupPopupComponent, {
      width: "350px"
    });

    dialogRef.afterClosed().subscribe(result => { });
  }

}
