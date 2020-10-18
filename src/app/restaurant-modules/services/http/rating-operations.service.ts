import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ServerDomainService} from "../../../services/http/server-domain.service";

@Injectable()
export class RatingOperationsService {
	private serverDomain:string;
	private rawDomain:string;

  constructor(private  http: HttpClient,private httpDomain:ServerDomainService){
        this.rawDomain = this.httpDomain.getDomain();
        this.serverDomain = this.rawDomain+"/manage/rating";
  }


  public getRestaurantRating(){
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    const options = {headers:headers};
    return this.http.get(this.serverDomain+"/getratingdetails",options)
  }

  public getRestaurantReviews(){
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    const options = {headers:headers};
    return this.http.get(this.serverDomain+"/getreviews",options)
  }

  public sendReply(reply){
    
    let headers = new HttpHeaders({'Content-Type':'application/json'});
    const options = {headers:headers};
    return this.http.post(this.serverDomain+"/sendreply",reply,options)
  }


}






