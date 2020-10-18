import { Component, OnInit } from '@angular/core';
import {AccountRecoverProcessService} from "../../services/data/account-recover-process.service";

@Component({
  selector: 'app-unable-to-recover',
  templateUrl: './unable-to-recover.component.html',
  styleUrls: ['./unable-to-recover.component.css']
})
export class UnableToRecoverComponent implements OnInit {
  public isAdmin:boolean = false;
  constructor(private acctRecover:AccountRecoverProcessService) { }

  ngOnInit() {
    let userType = this.acctRecover.getUserInformation("userType");

    console.log(userType)
    if(userType == "admin" || userType == "administrator" || userType == "customer")this.isAdmin = true;
  }

}
