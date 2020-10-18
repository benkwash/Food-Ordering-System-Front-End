import { Component, OnInit } from '@angular/core';
import {AppProductInformationService} from "../../services/other/app-product-information.service";

@Component({
  selector: 'app-printable-footer',
  templateUrl: './printable-footer.component.html',
  styleUrls: ['./printable-footer.component.css']
})
export class PrintableFooterComponent implements OnInit {
  public companyName:string = "";
  public productWebsite:string = "";
  
  constructor(private productInfo:AppProductInformationService) {
    //retrieve company name and product webstie
    this.companyName = this.productInfo.getCompanyName();
    this.productWebsite = this.productInfo.getProductWebsite();
  }

  ngOnInit() {
  }

}
