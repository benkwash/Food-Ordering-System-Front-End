import { Injectable } from '@angular/core';
import { Router , RoutesRecognized } from '@angular/router';

import {filter, pairwise } from 'rxjs/operators'
import {AppDataService} from "../data/app-data.service";

@Injectable()
export class RouterUrlTrackingService {
	private previousUrl:string = null;
	private currentUrl:string = null;

	constructor(private router:Router,private appData:AppDataService)
	{
		//set the previous and current route urls when route is recognized
		this.router.events.pipe(
			filter(e => e instanceof RoutesRecognized),
			pairwise()
		).subscribe((e: any[]) => {
			//set previous url and current urls
			this.previousUrl =e[0].urlAfterRedirects;
			this.currentUrl = e[1].urlAfterRedirects;
		});
	}

	//get previous ulr
	public getPreviousUrl(){
		return this.previousUrl;
	}

	//get current url
	public getCurrentUrl() {
		return this.currentUrl;
	}

	/**
	 * redirect to previous page and back to the current page.
	 * this is done retrieve the latest changes after a server synchronization
	 * with the offline system.
	 */
	public refreshCurrentUserUIRoute()
	{
		//navigate to the home page of the user and back to the original url
		let user = this.appData.getAccountType();
		let previousUrl = "/school/"+user+"/home";
		let currentUrl =	this.currentUrl;

		//navigate to the previous route, and back to the current route.
		if(previousUrl !== currentUrl)
		{
			this.router.navigateByUrl(previousUrl)
				.then((succeeds)=>{

					//after navigating away, the original url becomes the previous url
					//else use the current url before the navigation.
					currentUrl = currentUrl ? currentUrl : this.previousUrl;

					this.router.navigateByUrl(currentUrl);
				});
		}
	}
}
