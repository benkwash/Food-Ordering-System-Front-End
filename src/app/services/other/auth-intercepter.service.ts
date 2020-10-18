import { Injectable } from '@angular/core';
import {
	HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,
	HttpErrorResponse
} from "@angular/common/http";
import {Router} from "@angular/router";
import {Observable, of} from 'rxjs';
import { tap , catchError, retry} from 'rxjs/operators';

//services
import {ServerResponseFormat} from "./server-response-format";
import {AppDataService} from '../data/app-data.service';
import {PushNotificationService} from "./push-notifications.service";
import {AuthenticationService} from "./authentication.service";

@Injectable()
export class AuthIntercepterService implements HttpInterceptor {
	private authTokenAvailable:boolean = true; //checks whether token is available or not
	constructor( private appData:AppDataService,private router:Router,
					 private authService:AuthenticationService,
					 private notifications:PushNotificationService) {}

	intercept(req: HttpRequest<any>, next: HttpHandler):Observable<HttpEvent<any>>
	{
		//add token to request
		// Get the auth token from the service.
		const authToken = this.appData.getUserToken();

		// Clone the request and replace the original headers with
		// cloned headers, updated with the authorization.
		//XSRF Protection
		//XSRF-TOKEN cookie has to be sent all the time. for server to validate
		//withCredentials:true adds any cookies for this domain
		let cloneOptions = {setHeaders: { Authorization: authToken },withCredentials:true};

		//retrieve all headers if authToken is empty(not available)
		if(authToken == ""){
			this.authTokenAvailable = false;
			cloneOptions["observe"] = 'response'; //return full response
		}else {
			this.authTokenAvailable = true;
		}

		//new request clone;
		const authReq = req.clone(cloneOptions);

		// send cloned request with header to the next handler.
		// intercepts the response on its way back to the application
		return next.handle(authReq)
			.pipe(
				tap(response => {
					//check response information for access denied stuff
					// There may be other events besides the response.
					if (response instanceof HttpResponse) {
						this.handleFirstResponse(response);
					}
				}),
				retry(3), // retry a failed request up to 3 times
				catchError((error : HttpErrorResponse) =>
				{
					//handle catching of errors
					this.handleCaughtError(error);

					//return an identical response similar to an http response
					//nothing will happen since error is not processed
					let response:ServerResponseFormat = {
						response:"error", status:500, msg:"A problem occurred", form:null,
						data:{token:null,fetched:{},path:null,other:null}
					};
					//return observable
					// return Observable.of(new HttpResponse({body: [{name: "Default value..."}]}));
					return of(new HttpResponse({body:response}));
				})
			);
	}

	// handle response and check whether access was denied/granted
	// redirect to login if access was denied
	// else continue with normal process
	private handleFirstResponse(response:any)
	{
		if(response.body && response.body.status && response.body.status == "401") {
			//access was denied.
			// reroute user to login page  but prevent the automatic login of user
			//because all server authentication means failed
			this.router.navigate(['/signIn'],{queryParams:{stopDefault:"true"}});
		}
		else if( response.body &&
			     ((response.body.status && response.body.status == "500") ||
				  (response.body.response && response.body.response == "error"))
		) {
			//errors occurring on the server will be returned with status of 500 or message:error
			//push notification
			this.notifications.notifyError(response.body.msg);
		}
		else if(!this.authTokenAvailable)
		{
			//authorization token isn't available and token is used
			//reaching this code block means access isn't denied

			//retrieve the headers
			let token = response.headers.get('X-AITPROJECT-ACCESS-TOKEN');
			let url = response.headers.get('X-AITPROJECT-ROUTE-URL');
			let accountType = response.headers.get('X-AITPROJECT-USER-TYPE');

			//set information if all are available
			if(token && url && accountType){
				//sign user in and authenticate user
				this.appData.setUserToken(token);
				this.appData.setAccountType(accountType);
				this.appData.setUrl(url);
				this.authService.signUserIn(); //signUser in;
			}
		}
	}//end of method

	//handle server errors/client-side errors
	//push messages to notification service
	private handleCaughtError(error: any)
	{
		
	}//end of method
}
