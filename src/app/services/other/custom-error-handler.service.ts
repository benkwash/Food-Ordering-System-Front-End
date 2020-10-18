import { Injectable, Injector, ErrorHandler } from '@angular/core';
import {	HttpEvent, HttpResponse, HttpErrorResponse } from "@angular/common/http";
import {PushNotificationService} from "./push-notifications.service";
import {Router} from "@angular/router";
import {AppErrorLoggerService} from "./app-error-logger.service";
// import {LocalInterfaceTablesService} from "../offline-database/local-interface-tables.service";
import {AppDataService} from "../data/app-data.service";

@Injectable()
export class CustomErrorHandlerService implements ErrorHandler
{
	private errNotifier;
	private router;
	private errorsLogger;
	private localInterfaceTables;
	private appDataServ;

	// Because the ErrorHandler is created before the providers,
	// we’ll have to use the Injector to get them.
	constructor(private injector: Injector) { }

	handleError(error: any)
	{
		//inject some key services
		this.errNotifier = this.injector.get(PushNotificationService);
		this.appDataServ = this.injector.get(AppDataService);
		// this.localInterfaceTables = this.injector.get(LocalInterfaceTablesService);
		this.router = this.injector.get(Router);
		this.errorsLogger = this.injector.get(AppErrorLoggerService);

		if (error instanceof HttpErrorResponse) {
			// Server or connection error occurred with server requests
			this.handleServerOrConnectionError(error);
		}
		else {
			// Handle Client Error (Angular Error, ReferenceError...,etc)
			this.handleClientSideError(error);
		}

		//comment error later
		// console.log('custom error handler');
		// console.log(error);
	}//end of handle

	//handle server or connection error when requests are made
	handleServerOrConnectionError(error)
	{
		// console.log('error in custom error handler');
		// console.log(error);

		// Handle offline error
		//send a no internet connection message when offline
		//or the server message generated
		if (!navigator.onLine)
		{
			//send debug information to server
			// this.errorsLogger.submitLog(error).subscribe();

			//push notification error
			return this.errNotifier.notifyError('You seem to be offline');
		}
		else {
			// Handle Http Error (error.status === 403, 404...)
			let errorMsg = (error instanceof ProgressEvent) ? "Could not connect to server. You may be offline.":
				"A problem occurred on the server.";

			//push notification error
			return this.errNotifier.notifyError(errorMsg);
		}
	}

	handleClientSideError(error)
	{
		
		// Handle Client Error (Angular Error, ReferenceError...)
		//send debug information to server
		this.errorsLogger.submitLog(error)
			.subscribe(response => {
			});
		
		// redirect to error component
		this.router.navigate(['/error']);
	}//end of handling clientSide error
}
