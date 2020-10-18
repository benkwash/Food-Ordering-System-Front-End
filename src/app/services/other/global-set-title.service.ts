import { Injectable } from '@angular/core';
import {Router,ActivatedRoute,NavigationEnd} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {switchMap, filter } from 'rxjs/operators'

@Injectable()
export class GlobalSetTitleService {

	constructor(private router:Router,private route:ActivatedRoute,private titleService:Title)
	{
		//subscribe to navigation completed
		this.router.events.pipe(
			filter(e => e instanceof NavigationEnd),
			switchMap(() =>
			{
				//get the first child route
				let child = this.route.firstChild;

				//loop through the child routes till the last active route is found(the next one is null)
				while (child) {
					//if the next child route is null, then the current is the last one
					if (child.firstChild) {
						child = child.firstChild;
					}else {
						break;
					}
				}

				//return the data property
				return child.data;
			})
		).subscribe((routeData:any) => {
			//get title in data
			const title = routeData["title"];

			if(title){
				this.titleService.setTitle(title);
			}
		});
	}
}
