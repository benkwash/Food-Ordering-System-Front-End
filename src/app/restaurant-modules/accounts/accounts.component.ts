import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router, Data } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Observable } from "rxjs";

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


//services
import { PushNotificationService } from "../../services/other/push-notifications.service";
import { AccountsOperationsService } from '../services/http/accounts-operations.service'
import { AuthenticationService } from "../../services/other/authentication.service"
import { replace } from 'lodash';

export interface revenueSummary {
	month: string;
	amount: number;
}

  export interface nDaysSummary {
	date: string;
	amount: number;
  }
@Component({
	selector: "app-accounts",
	templateUrl: "accounts.component.html",
	styleUrls: [
		"accounts.component.css"
	]
})

export class AccountsComponent implements OnInit  {


	displayedColumns = ['month', 'revenue'];
	firstData:revenueSummary[];
	totalCost=null;

	nDaysColumn=['date','revenue'];
	nDays:nDaysSummary[];
	totalNDaysCost=null;
   
    constructor(
        private route: ActivatedRoute, private notify: PushNotificationService, 
        private http: AccountsOperationsService,private authenticate: AuthenticationService, 
        public dialog: MatDialog
	) {
        
    }

    getAccountDetailsOnLoad(){
		this.http.getRestaurantAccounts()
		.subscribe((response:any)=>{
			this.firstData=response.data.fetched;
			this.totalCost=this.firstData.map(t => t.amount).reduce((acc, value) => acc + value, 0);
		})
	}


	getNDays(){
		this.http.getNDaysDetails()
		.subscribe((response:any)=>{
			this.nDays=response.data.fetched;
			this.totalNDaysCost=this.nDays.map(t => t.amount).reduce((acc, value) => acc + value, 0);
		})
	}
    ngOnInit() {
		this.getAccountDetailsOnLoad();
		this.getNDays();
	}
}