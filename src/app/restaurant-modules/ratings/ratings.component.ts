import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router, Data } from "@angular/router";
import { NgForm } from "@angular/forms";
import { Observable } from "rxjs";

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


//services
import { PushNotificationService } from "../../services/other/push-notifications.service";
import { RatingOperationsService } from '../services/http/rating-operations.service'
import { AuthenticationService } from "../../services/other/authentication.service"
import { replace } from 'lodash';


@Component({
	selector: "app-ratings",
	templateUrl: "ratings.component.html",
	styleUrls: [
		"ratings.component.css"
	]
})

export class RatingsComponent implements OnInit  {

    //rating
    resRating = {
		rating: null,
		outOf: null,
		breakdown: {
			five: null,
			four: null,
			three: null,
			two: null,
			one: null
		}
    }
    
    //reviews
    resReviews=<any>[];

    // reviewReply="";

    constructor(
        private route: ActivatedRoute, private notify: PushNotificationService, 
        private http: RatingOperationsService,private authenticate: AuthenticationService, 
        public dialog: MatDialog
	) {
        
    }


    sendReply(id){
        let tempReview=null
        this.resReviews.forEach((doc,index) => {
            if(doc._id==id)tempReview=doc;
        });
        // tempReview.
        let resReply={
            _id:id,
            by:null,
            date: new Date(),
            reply:tempReview.reply
        }

        //send reply //backend
        this.http.sendReply(resReply)
        .subscribe((response:any)=>{
            if(response.response=="okay"){
                //if succesfully update in db//backend
                if(response.data.fetched){
                    //push into the replies array
                    this.resReviews.forEach(element => {
                        if(element._id==id){
                            element.review.replies.push({
                                by:null,
                                date:resReply.date,
                                reply:resReply.reply
                            })
                            element.reply=null;
                        }
                    });
                }
            };
        })
    }

    getRating(){
		this.http.getRestaurantRating()
		.subscribe((response:any)=>{
			if(response.response=="okay"){
                let resData=response.data.fetched;
                this.resRating.rating=resData.rating;
                this.resRating.outOf=resData.outOf;
                this.resRating.breakdown=resData.breakdown
			}
		})
    }
    
    getReviews(){
        this.http.getRestaurantReviews()
		.subscribe((response:any)=>{
			if(response.response=="okay"){
                this.resReviews=response.data.fetched;
            }
            // console.log(response.data.fetched)
		})
    }
    

    ngOnInit() {
        this.getRating()
        this.getReviews()
	}
}