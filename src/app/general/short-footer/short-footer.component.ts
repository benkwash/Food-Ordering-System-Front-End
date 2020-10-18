import { Component, OnDestroy  } from '@angular/core';
import {FooterPrintService} from "../../services/other/footer-print.service";
import { Subscription }   from 'rxjs';
import {AppProductInformationService} from "../../services/other/app-product-information.service";

@Component({
  selector: 'app-short-footer',
  templateUrl: './short-footer.component.html',
  styleUrls: ['./short-footer.component.css']
})
export class ShortFooterComponent implements OnDestroy{
  public disableDuringPrint:boolean=false;
  public subscription:Subscription;
  public companyName:string = "";
  public showTermsConditions:boolean = false;
  constructor(private mainFooterPrint:FooterPrintService,private productInfo:AppProductInformationService)
  {
    //retrieve company name
    this.companyName = this.productInfo.getCompanyName();
    
    //subscribe to changes in footer disable
    this.subscription = this.mainFooterPrint.getMainFooterPrintDisableStatus()
       .subscribe(status=>{
         this.disableDuringPrint = status;
       });

    //by default, enable printing of main footer
    this.mainFooterPrint.enableMainFooterDuringPrint();
  }

  public openTermsConditions():void {
    this.showTermsConditions = true;
  }
  public closeTermsConditions($event):void {
    this.showTermsConditions = false;
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscription.unsubscribe();
  }
}
