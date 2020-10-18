import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

import{AuthenticationService} from "../services/other/authentication.service";
import {AppBackendOperationsService} from "../services/http/app-backend-operations.service";
import {AppDataService} from "../services/data/app-data.service";

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: []
})
export class LogoutComponent implements OnInit {

  constructor(private authService:AuthenticationService,private router:Router,
 				  private appOp:AppBackendOperationsService) {
  }

  	ngOnInit()
	{
		//send a logout request to server to remove any token
		//async operation will execute immediately so when response is ready,
		//then perform the synchronous operations before redirecting.
		this.appOp.logOutUser().subscribe(
			(res=>{}),
			(err=>{}),
			()=> {
				//on async operation complete
				//log user out
				this.authService.logout();

				// reroute user to login page  but prevent the automatic login of user
				//query param prevents automatic login of user.
				this.router.navigate(['/']);
			});
  	}

	

}
