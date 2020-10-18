import { Injectable } from '@angular/core';

@Injectable()
export class UserPasswordInfoService {

	//keep the password in memory not in session storage for security reasons
	private savedKey:{password:string,expires:any} = null;
	constructor() { }

	//Retrieve user's account password.
	//If password exists locally and hasn't expired, return to the calling code
	public getLocalPassword()
	{
		let localPassword = "";

		if(this.savedKey)
		{
			//info : {password:value,expires:value}
			const info = this.savedKey;

			//compare current time to expiry time
			if(info.expires) {
				const expiry = new Date(info.expires).getTime();
				const now = new Date().getTime();

				//if password hasn't expired and password exits, return
				//the expiry time should be ahead of the current time
				localPassword = (now < expiry && info.password) ? info.password : "";
			}
			else {
				//if no expires field is available, then invalidate the password.
				localPassword = "";
			}
		}
		else {
			//set password to an empty string if nothing exists
			localPassword = "";
		}

		return localPassword;
	}

	//save password in memory
	public savePasswordLocally(password)
	{
		//by default password expires in 1hr.
		//1s = 1000ms
		//1.Get current timestamp. 60min*60s
		//2. Add 60min * 60s * 1000ms = 3600s * 1000;
		//3. Add the value to current timestamp and create a new date from it.
		let timestamp = (new Date().getTime()) + (3600 * 1000);
		const expiryTime = new Date(timestamp);

		this.savedKey = {password:password,expires:expiryTime};
	}

	//remove local password info
	public removeLocalPassword(){
		this.savedKey = null;
	}
}
