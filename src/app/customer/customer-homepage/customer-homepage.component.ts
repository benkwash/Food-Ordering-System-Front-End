import { Component, OnInit,ViewChild,Input} from '@angular/core';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";

//services
import {CustomValidatorsService} from "../../services/other/custom-validators.service";
import {AppBackendOperationsService} from "../../services/http/app-backend-operations.service";
import{AppDataService} from "../../services/data/app-data.service";
import{AuthenticationService} from "../../services/other/authentication.service";
import {PushNotificationService} from "../../services/other/push-notifications.service";
import {CustomerUnsignedService} from '../services/http/customer-unsigned.service'

@Component({
  selector: 'app-customer-homepage',
  templateUrl: './customer-homepage.component.html',
  styleUrls: ['./customer-homepage.component.css']
})
export class CustomerHomepageComponent implements OnInit {
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
        city:""
    }
    constructor(private http:CustomerUnsignedService, private router:Router){
        
    }


    onSearch(){

        if(this.formState.region!="" && this.formState.city!=""){
            this.router.navigate(['/customer/restaurants',this.formState])
        }else if(this.formState.region==""){
            this.form.controls['sregion'].setErrors({'incorrect':true})
        }else this.form.controls['city'].setErrors({'incorrect':true})
        // console.log(this.formState)
        // this.http.getRestaurants(this.formState)
        // .subscribe((response)=>{
        //     console.log(response)
        // })
    }


    ngOnInit(){

    }

}