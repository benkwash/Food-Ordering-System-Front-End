export interface ServerResponseFormat {
		response:string,
		status:number,
		msg:string,
		form:any,
		data:{
			"token": string,
			"path": string,
			"fetched":any,
			"other": any
		}
}
