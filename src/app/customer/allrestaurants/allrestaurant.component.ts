import { Component, OnInit,ViewChild} from '@angular/core';
import {Router,ActivatedRoute} from "@angular/router";
import {NgForm} from "@angular/forms";

//services
import {CustomValidatorsService} from "../../services/other/custom-validators.service";

import {CustomerUnsignedService} from '../services/http/customer-unsigned.service'
import { ServerDomainService } from 'src/app/services/http/server-domain.service';

@Component({
  selector: 'app-allrestaurants',
  templateUrl: './allrestaurants.component.html',
  styleUrls: ['./allrestaurants.component.css']
})
export class AllrestaurantsComponent implements OnInit {
    @ViewChild('form') form:NgForm;

    public regions=[
        "Ashanti Region",
        "Bono Region",
        "Bono East Region",
        "Ahafo Region",
        "Central Region",
        "Eastern Region",
        "Greater Accra Region",
        "Nothern Region",
        "Savannah Region",
        "North East Region",
        "Upper East Region",
        "Upper West Region",
        "Volta Region",
        "Oti Region",
        "Western Region",
        "Western north Region"
    ]
    public formState={
        region:"",
        city:"",
        pageNumber:1,
        option:""
    }
    public allRestaurants:any=[];

    logoAssestDir=""

    constructor(private http:CustomerUnsignedService, private router:Router, private route:ActivatedRoute,
        private serverDomain:ServerDomainService){
            this.logoAssestDir = this.serverDomain.getImgAssetsUrlDir();

    }


    onSearch(option){
        this.formState.option=option;

        this.http.getRestaurants(this.formState)
        .subscribe((response:any)=>{
            if(response.response=="okay"){
                this.allRestaurants=response.data.fetched;
            }
              console.log(response.data.fetched)  
        })
    }

    selectedRestaurant(index){

        let resID=this.allRestaurants[index].resID;
        let currentCity=this.allRestaurants[index].dCity;

        this.router.navigate(['/customer/restaurantmenu'],{
            queryParams:{
                restaurantID:resID,city:currentCity,orderOption:this.formState.option
            }});
    }


    ngOnInit(){

        let params=this.route.snapshot.params;
        this.formState.region=params.region;
        this.formState.city=params.city;
        this.formState.option="delivery";

        if(this.formState.region&& this.formState.city){
            this.http.getRestaurants(this.formState)
            .subscribe((response:any)=>{
                console.log(response.data.fetched)
                if(response.response=="okay"){
                    this.allRestaurants=response.data.fetched;
    
                }
            })
        }
        


    }

}