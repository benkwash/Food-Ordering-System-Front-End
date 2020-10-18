import {Injectable} from "@angular/core";
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,CanActivateChild} from '@angular/router';
import {Observable} from "rxjs";
import {AuthenticationService} from "../../../services/other/authentication.service";
import {AppBackendOperationsService} from "../../../services/http/app-backend-operations.service";

@Injectable()
export class AdminAuthGuardService  implements CanActivate,CanActivateChild{
	constructor(private authService: AuthenticationService,private router: Router,
				  private appOp:AppBackendOperationsService) {}

  	canActivate(route: ActivatedRouteSnapshot,state:RouterStateSnapshot):Observable<boolean> | Promise<boolean> | boolean
	{
		//retrieve the current route being navigated to
		//pass the route url to as query params to login if authentication fails
		const routeUrl = state.url;

		//user must be authenticated(logged in)
		//and only an admin is allowed here
    	if(this.authService.isAuthenticated() && this.authService.isAdmin()) {
      	return true;
    	}
    	else if(!this.authService.isAuthenticated())
		{
			//user isn't authenticated
			let that = this;

			//return a promise instead because the observable is causing an error
			//interceptor add tokens if exist and in the response sign's the user in if token is returned
			return new Promise(function(resolve,reject)
			{
				//make an http request to the server checking whether user has access;
				that.appOp.checkUserAccess()
					.subscribe((response:any)=> {
						//httpinteceptor will automatically authenticate and signin
						//now check again whether user is authenticated
						if(that.authService.isAuthenticated() && that.authService.isAdmin()){
							resolve(true);
						}else {
							//re-route with original url
							that.router.navigate(['signIn'],{queryParams:{referrerUrl:routeUrl}});
							resolve(false);
						}
					});
			});
    	}
		else {
			//re-route with original url
			this.router.navigate(['signIn'],{queryParams:{referrerUrl:routeUrl}});
			return false;
		}
   }

  canActivateChild(route:ActivatedRouteSnapshot,
                   state:RouterStateSnapshot):Observable<boolean>|Promise<boolean>|boolean
  {
    return this.canActivate(route,state);
  }
}
