import { Injectable,Injector } from '@angular/core';
import {HttpClient, HttpHeaders, HttpErrorResponse} from '@angular/common/http';
import {ServerDomainService} from "../http/server-domain.service";
import {Location, LocationStrategy, PathLocationStrategy} from "@angular/common";
// Cool library to deal with errors: https://www.stacktracejs.com
import * as StackTraceParser from 'error-stack-parser';

@Injectable()
export class AppErrorLoggerService {
	private httpDomain;
	private syncOp;
  constructor(private injector: Injector,private http:HttpClient) { }

	submitLog(error)
	{
		this.httpDomain = this.injector.get(ServerDomainService);
		let serverDomain = this.httpDomain.getDomain();

		let headers = new HttpHeaders({'Content-Type':'application/json'});

		//append some headers & params to hide request (no error & no loading bar)
		let options = this.syncOp.appendHiddenParamsToOptions({headers:headers});

		// Send error to server
		const errorToSend = this.addContextInfo(error);
		return this.http.post(serverDomain+'/debug_info',{"errorInfo":errorToSend},options);
	}
	
	//submit error saved in the local (browser) db without getting the context info
	//NOTE: locally saved error has the dateSaved info attached to it
	//extract the date and add 
	submitLogFromLocalDB(errorToSend,dateSaved)
	{
		this.httpDomain = this.injector.get(ServerDomainService);
		let serverDomain = this.httpDomain.getDomain();

		let headers = new HttpHeaders({'Content-Type':'application/json'});

		//append some headers & params to hide request (no error & no loading bar)
		let options = this.syncOp.appendHiddenParamsToOptions({headers:headers});

		let form = {"errorInfo":errorToSend,dateSaved:dateSaved};
		return this.http.post(serverDomain+'/debug_info',form,options);
	}

	public addContextInfo(error)
	{
		// All the context details that you want
		// (usually coming from other services; Constants, UserService...)
		const name = error.name || null;
		const appId = 'restaurant-info-app';
		const location = this.injector.get(LocationStrategy);
		const url = location instanceof PathLocationStrategy ? location.path() : '';
		const status = error.status || null;
		const message = error.message || error.toString();
		const stack = error instanceof HttpErrorResponse ? null : StackTraceParser.parse(error);
		const errorToSend = { name:name, appId:appId, url:url, status:status, message:message, stack:stack};

		return errorToSend;
	}
}
