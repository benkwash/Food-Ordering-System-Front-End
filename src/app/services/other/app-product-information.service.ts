import { Injectable } from '@angular/core';

@Injectable()
export class AppProductInformationService {

  private COMPANY_NAME:string = "Benjamin Kwashie Technologies Limited";
  private PRODUCT_NAME:string = "comeCho";
  private PRODUCT_TEST_STAGE:string = "";
  private PRODUCT_WEBSITE:string = "dummy.myaitproject.com";
  constructor() { }

  //get company name
  getCompanyName(){
    return this.COMPANY_NAME;
  }

  //get product/service/platform name
  getProductName(){
    return this.PRODUCT_NAME;
  }

  //get product/service/platform website for footer information
  getProductWebsite() {
    return this.PRODUCT_WEBSITE;
  }

  //get product/service/platform testing phase for navbar
  getProductTestingStage() {
    return this.PRODUCT_TEST_STAGE;
  }

}
