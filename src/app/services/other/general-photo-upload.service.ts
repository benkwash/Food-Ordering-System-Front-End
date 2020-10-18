import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse, HttpEventType} from '@angular/common/http';
import {Observable, Subject} from "rxjs";
import {ServerDomainService} from "../http/server-domain.service";

@Injectable()
export class GeneralPhotoUploadService {
	private serverDomain:string;

	constructor(private http: HttpClient,private httpDomain:ServerDomainService){
		this.serverDomain = this.httpDomain.getDomain()+"/uploads";
	}

	/**
	 * upload user's photo
	 * upload photo returns an observable of a number{status of upload}
	 * number will be used for progress bar
	 * progress returns -1 if completed along with server response after completion
	 * @param file
	 * @param oldPhotoPath
	 * @returns {Observable<{progress: number, response: any}>}
	 */
	public uploadPhoto(file: File):Observable<any>
	{
		//set form data
		//add uploaded file and or oldPhotoPath(existing fileName for deletion)
		const formData: FormData = new FormData();
		formData.append("photo", file, file.name);

		// send the http-request and subscribe for progress-updates
		// create a new progress-subject for every file
		let progress = new Subject<{progress:number,response:any}>();

		//post form http request options
		let options:any = {reportProgress: true, observe: 'events', headers: { ignoreLoadingBar: '' }};

		//create http request and send data
		// send the http-request and subscribe for progress-updates
		this.http.post(this.serverDomain+'/photo',formData,options)
			.subscribe((event:any) =>
			{
				//upload in progress
				if (event.type === HttpEventType.UploadProgress) {
					// calculate the progress percentage
					let percentDone = Math.round((100 * event.loaded) / event.total);

					// pass the percentage into the progress-stream
					progress.next({progress:percentDone,response:{}});
				} else if (event.type === HttpEventType.Response || event instanceof HttpResponse) {
					//upload completion
					//pass http response before to subscriber before completing
					progress.next({progress:-1,response:event});

					// Close the progress-stream if we get an completion from the API
					// The upload is complete
					progress.complete();
				}
			},(err)=> progress.error(err));

		// Save every progress-observable
		// return the map of progress.observables
		return progress.asObservable();
	}//end of method

}
