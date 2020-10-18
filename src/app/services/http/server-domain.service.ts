export class ServerDomainService {
	public serverDomain:string;
	public chatServerDomain:string;
	constructor() {
		this.serverDomain = 'http://localhost:3500';
		// this.chatServerDomain = 'http://localhost:4500';
	}

	public getDomain():string {
		return this.serverDomain;
	}

	public getChatServerDomain():string {
		return this.chatServerDomain;
	}

	//get assets path(url) for pictures
	public getImgAssetsUrlDir(){
		//google cloud storage image paths
		return "https://storage.googleapis.com/ait-project-5a1f8.appspot.com"
	}
}
