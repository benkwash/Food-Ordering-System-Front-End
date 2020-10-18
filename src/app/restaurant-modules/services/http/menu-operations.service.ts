import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ServerDomainService} from "../../../services/http/server-domain.service";

@Injectable()
export class MenuOperationsService {
	private serverDomain:string;
	private rawDomain:string;

  constructor(private  http: HttpClient,private httpDomain:ServerDomainService){
		this.rawDomain = this.httpDomain.getDomain();
		this.serverDomain = this.rawDomain+"/manage/menu";
  }

	public getBackendAdminServerUrl():string {
		return this.serverDomain;
	}

  
	//get all restaurant menu
	public getAllMenu(){
		// let headers= new HttpHeaders({})	
		let options ={}
		return this.http.get(this.serverDomain+'/getallmenu',options)
	}

	//get specific menu information given the menu's ID
	public getMenuInfo(menuID){
			let params = new HttpParams()
				.set("menuID",menuID);
			// let headers = new HttpHeaders({'Content-Type':'application/json'});
			const options = {params:params};
			
			return this.http.get(this.serverDomain+'/getmenuinformation',options)
		}
	//savenewmenu
	public saveNewMenu(menu){
		// let params = new HttpParams()
		// 	.set("ifNew",ifNew);
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};
		
		return this.http.post(this.serverDomain+'/savenewmenu',menu,options)
	}
	
	public updateMenu(menu){
		///updatemenu
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};
		
		return this.http.post(this.serverDomain+'/updatemenu',menu,options)
	}

	public deleteMenu(menu){
		///updatemenu
		let headers = new HttpHeaders({'Content-Type':'application/json'});
		const options = {headers:headers};
		
		return this.http.post(this.serverDomain+'/deletemenu',menu,options)
	}
}
