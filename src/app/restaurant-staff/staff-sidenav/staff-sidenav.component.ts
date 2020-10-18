import { Component, OnInit, Output, EventEmitter } from "@angular/core"
import { StaffOperationsService } from "../services/http/staffOperations.service"

//services
import {AuthenticationService} from "../../services/other/authentication.service"
import { ServerDomainService } from "../../services/http/server-domain.service";

@Component({
    selector: "app-staff-sidenav",
    templateUrl: "./staff-sidenav.component.html",
    styleUrls: [
        './staff-sidenav.component.css'
    ]
})

export class StaffSidenav implements OnInit {
    @Output() toggleSideBar:EventEmitter<any>=new EventEmitter;


    staffName: string = "";
    staffPicture: string = "";

    resName: string = null;
    resPicture: string = null;

    logoAssestDir = "";

    permissions={

        menu:false,
        staff:false,
        orders:false,
        delivery:false,
        accounts:false,
        rating:false
	}
    constructor(
        private http: StaffOperationsService,
        private serverDomain: ServerDomainService,
        private auth:AuthenticationService) {
        this.logoAssestDir = this.serverDomain.getImgAssetsUrlDir();
        this.permissions=JSON.parse(this.auth.getStaffPermissionsStorage());

    }


    sidebarToggle(){
        this.toggleSideBar.emit();
    }
    
    ngOnInit() {
        this.getRestaurantInfo()
    }

    getRestaurantInfo(){
        this.http.getRestaurantInfo()
        .subscribe((response:any)=>{
            let res=response.data.fetched
            this.resName=res.name;
            this.resPicture=res.picture;
        })
    }
   
}