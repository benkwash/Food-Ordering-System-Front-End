import { Injectable } from '@angular/core';

@Injectable()
export class AccountRecoverProcessService {

	//Account recover process
	//indicates whether phase have been completed or not
	//default to all not completed
	private phaseCompletion =  {
		forgetPasswordPhase:false, oldPasswordPhase:false,
		emailRecoveryCode:false, recoveryNumberPhase:false
	};

	//information for recovery process
	private userInfo = {
		username:null,
		userType:null,
		retrievedRecoverySpecs:{
			oldPasswords: false, userEmail: false,
			recoveryEmail: false,recoveryNumber: false
		},
		recoveryOptions:{
			email:null,number:null
		},
		oldPassword:null,
		verificationCode:null
	};

	constructor() { }

	//set phase completion
	public setPhaseCompletion(phase:string):void
	{
		if(phase == "forgetPassword")
			this.phaseCompletion.forgetPasswordPhase = true;
		else if(phase == "oldPassword")
			this.phaseCompletion.oldPasswordPhase = true;
		else if(phase == "emailRecoveryCode")
			this.phaseCompletion.emailRecoveryCode = true;
		else if(phase == "recoveryNumber")
			this.phaseCompletion.recoveryNumberPhase = true;
	}

	//get phase completion
	public isPhaseCompleted(phase:string):boolean
	{
		if(phase == "forgetPassword")
			return this.phaseCompletion.forgetPasswordPhase;
		else if(phase == "oldPassword")
			return this.phaseCompletion.oldPasswordPhase;
		else if(phase == "emailRecoveryCode")
			return this.phaseCompletion.emailRecoveryCode;
		else if(phase == "recoveryNumber")
			return this.phaseCompletion.recoveryNumberPhase;
	}

	//user user information
	public setUserInformation(infoType:string,value:any)
	{
		if(infoType == "username")
			this.userInfo.username = value;
		if(infoType == "userAccountType")
			this.userInfo.userType = value;
		else if (infoType == "recoverySpecs")
			this.userInfo.retrievedRecoverySpecs = value;
		else if (infoType == "recoveryOptions")
			this.userInfo.recoveryOptions = value;
		else if(infoType == "oldPassword")
			this.userInfo.oldPassword = value;
		else if(infoType == "emailRecoveryCode")
			this.userInfo.verificationCode = value;
	}

	//retrieve username
	public getUserInformation(infoType:string) {
		if(infoType == "username")
			return this.userInfo.username;
		if(infoType == "userType")
			return this.userInfo.userType;
		else if (infoType == "recoverySpecs")
			return this.userInfo.retrievedRecoverySpecs;
		else if (infoType == "recoveryOptions")
			return this.userInfo.recoveryOptions;
		else if(infoType == "oldPassword")
			return this.userInfo.oldPassword;
		else if(infoType == "emailRecoveryCode")
			return this.userInfo.verificationCode;
		else if(infoType == "recoverySpecs.userEmail")
			return this.userInfo.retrievedRecoverySpecs.userEmail;
	}

	//reset all phase completions
	public resetAllPhaseCompletions():void
	{
		this.phaseCompletion.forgetPasswordPhase = false;
		this.phaseCompletion.oldPasswordPhase = false;
		this.phaseCompletion.emailRecoveryCode = false;
		this.phaseCompletion.recoveryNumberPhase = false;
	}

	//reset user information
	public resetUserInformation():void {
		this.userInfo.username = null;
		this.userInfo.userType = null;
		this.userInfo.retrievedRecoverySpecs = null;
		this.userInfo.recoveryOptions = null;
		this.userInfo.oldPassword = null;
		this.userInfo.verificationCode = null;
	}

	//reset the entire account recovery process information
	public resetEntireRecoverAccountProcess():void {
		//reset user data and phase completions
		this.resetUserInformation();
		this.resetAllPhaseCompletions();
	}

	/**
	 * Get the  next recovery process phase url for redirection
	 * @param {String} currentPhase - forgetPassword,oldPassword,userEmail, recoveryEmail, recoveryNumber
	 */
	public getNextRecoveryPhaseUrl(currentPhase)
	{
		//ACCOUNT RECOVERY PROCESS
		//forget-password...recoveryEmail...oldPassword...recoveryNumber(skip for now)...newPassword|failed

		if(currentPhase === "forgetPassword"){
			return '/account/recover/email';
		}
		else if(currentPhase === "recoveryEmail") {
			return '/account/recover/old_password';
		}
		else if(currentPhase === "oldPassword") {
			//NOTE
			//skip recovery using phone number
			// return '/account/recover/number';

			return '/account/recover/failed';
		}
		else if(currentPhase === "recoveryNumber") {
			return '/account/recover/failed';
		}
		else{
			//for the last phase
			return '/account/recover/failed';
		}
	}

	/**
	 * Get the previous recovery process phase url for redirection
	 * @param {String} currentPhase - forgetPassword,oldPassword,userEmail, recoveryEmail, recoveryNumber
	 */
	public getPrevRecoveryPhaseUrl(currentPhase){
		//ACCOUNT RECOVERY PROCESS : reverse
		//forget-password...recoveryEmail...oldPassword...recoveryNumber(skip for now)...newPassword|failed

		if(currentPhase === "recoveryEmail") {
			return '/account'; //forget-password(first phase)
		}
		if(currentPhase === "oldPassword") {
			return '/account/recover/email';
		}
		else if(currentPhase === "recoveryNumber") {
			return '/account/recover/old_password';
		}
		else if(currentPhase === "failed"){
			//NOTE
			//skip recovery using phone number
			// return '/account/recover/number';

			return '/account/recover/old_password';
		}
		else {
			return '/account'; //forget-password(first phase)
		}
	}
}
